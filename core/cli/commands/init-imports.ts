import { readImportAliases } from '../config/imports/index.js';

/**
 * Add the #bref subpath imports to package.json when absent. They map to a ui
 * directory inside the #lib/* target, or to src/lib/ui without one.
 * @param projectRoot Consumer project directory containing package.json.
 * @returns created after writing "#bref" and "#bref/*", or exists when either is
 * already declared. Existing imports are not changed.
 * @throws When package.json cannot be read, contains invalid JSON, its root or
 * imports field is not an object, or writing fails. Reading and writing are not
 * atomic; concurrent initialization of the same project is unsupported.
 */
export const initImports = async (projectRoot: string): Promise<'created' | 'exists'> => {
	const lib = (await readImportAliases(projectRoot))['#lib'] ?? 'src/lib';
	const file = Bun.file(`${projectRoot}/package.json`);
	const content = await file.text();
	const manifest: unknown = JSON.parse(content);
	if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest))
		throw new Error('package.json: expected a JSON object.');

	const imports = 'imports' in manifest ? manifest.imports : {};
	if (typeof imports !== 'object' || imports === null || Array.isArray(imports))
		throw new Error('package.json: "imports" must be an object.');
	if ('#bref' in imports || '#bref/*' in imports) return 'exists';

	const ui = lib === '.' ? './ui' : `./${lib}/ui`;
	const updated = {
		...manifest,
		imports: { ...imports, '#bref': `${ui}/index.js`, '#bref/*': `${ui}/*` }
	};
	const indent = /^[ \t]+(?=")/m.exec(content)?.[0] ?? '\t';
	await Bun.write(file, `${JSON.stringify(updated, null, indent)}\n`);
	return 'created';
};
