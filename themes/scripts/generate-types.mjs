import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const options = { moduleResolution: ts.ModuleResolutionKind.Bundler };
const resolveType = (specifier, importer) => {
	const resolved = ts.resolveModuleName(specifier, importer, options, ts.sys).resolvedModule;
	if (!resolved) throw new Error(`Cannot resolve ${specifier} from ${importer}`);
	return resolved.resolvedFileName;
};
const entry = resolveType('bref-ui/types', resolve(packageRoot, 'src/lib/index.ts'));
const sourceRoot = dirname(entry);
const destination = resolve(packageRoot, 'src/lib/shared-types');
const sources = new Map();

// Follow the public type graph, including icon names, without copying components or assets.
const collect = async (filename) => {
	const path = relative(sourceRoot, filename);
	if (path.startsWith('..') || isAbsolute(path))
		throw new Error(`Type import escapes the shared type directory: ${filename}`);

	if (sources.has(path)) return;
	const source = await readFile(filename, 'utf8');
	sources.set(path, source);
	for (const { fileName: specifier } of ts.preProcessFile(source).importedFiles)
		if (specifier.startsWith('.')) await collect(resolveType(specifier, filename));
		else if (specifier !== 'svelte' && !specifier.startsWith('svelte/'))
			throw new Error(`Unexpected shared type dependency: ${specifier}`);
};

await collect(entry);
await rm(destination, { recursive: true, force: true });
for (const [path, source] of sources) {
	const target = resolve(destination, path);
	await mkdir(dirname(target), { recursive: true });
	await writeFile(target, source);
}
