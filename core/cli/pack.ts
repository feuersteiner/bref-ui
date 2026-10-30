import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { compile } from 'svelte/compiler';
import { componentDocs } from '../.svelte-kit/reference/docs/index.js';
import { loadRegistry } from './registry/load/index.js';
import { planDependencies } from './registry/plan/index.js';
import { formatInstallation } from './documentation/format-installation.js';
import type { DocumentationCatalogue } from './documentation/types.js';

/** Validate the canonical registry and bundle typed references before assembling the package. */
const sourceRoot = fileURLToPath(new URL('../src/lib/', import.meta.url));
const registry = await loadRegistry(sourceRoot);
console.log(`Validated ${registry.size} registry entries for packaging.`);

const index = await readFile(`${sourceRoot}index.ts`, 'utf8');
const components = [...index.matchAll(/export \{ default as (\w+) \} from/g)].map(([, name]) => ({
	name,
	id: name.replace(/[A-Z]/g, (letter, position) => `${position ? '-' : ''}${letter.toLowerCase()}`)
}));
if (
	JSON.stringify(components.map(({ id }) => id).sort()) !==
	JSON.stringify(Object.keys(componentDocs).sort())
)
	throw new Error('Documentation must cover exactly every public component export.');
for (const doc of Object.values(componentDocs))
	for (const [, source] of doc.usage.matchAll(/```svelte\n([\s\S]*?)```/g))
		compile(source, { generate: 'server' });

const typeFile = `${sourceRoot}types.ts`;
const program = ts.createProgram([typeFile], {
	module: ts.ModuleKind.NodeNext,
	moduleResolution: ts.ModuleResolutionKind.NodeNext
});
const checker = program.getTypeChecker();
const exportedTypes = checker
	.getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(typeFile)!)!)
	.map((symbol) => {
		const resolved =
			symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
		return {
			name: symbol.name,
			files: (resolved.declarations ?? []).map(
				(declaration) => declaration.getSourceFile().fileName
			)
		};
	});
const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const cli = await readFile(new URL('../cli/documentation/cli.md', import.meta.url), 'utf8');
const catalogue: DocumentationCatalogue = {
	version,
	cli,
	components: Object.fromEntries(
		components.map(({ id, name }) => {
			const doc = componentDocs[id];
			const entries = registry.has(id) ? planDependencies(id, registry) : [];
			const types = exportedTypes
				.filter(
					(symbol) =>
						symbol.name === `${name}Props` ||
						new RegExp(`\\b${symbol.name}\\b`).test(doc.usage) ||
						symbol.files.some((file) => file.includes(`/src/lib/${id}/`)) ||
						doc.props.some((prop) => new RegExp(`\\b${symbol.name}\\b`).test(prop.type))
				)
				.map((symbol) => symbol.name)
				.sort();
			return [
				id,
				{
					name,
					...doc,
					copyable: entries.length > 0,
					installation: formatInstallation(id, name, entries, types)
				}
			];
		})
	)
};
await writeFile(new URL('./docs.json', import.meta.url), JSON.stringify(catalogue));
console.log(
	`Bundled documentation for ${components.length} public components (bref-ui v${version}).`
);
