import { readdir, readFile } from 'node:fs/promises';
import ts from 'typescript';

/** Reject missing/extra component references and invalid shared fields before packaging. */
export const validateDocs = async (components, publicExports, registry, sourceRoot) => {
	const ids = publicExports.map((entry) => entry.id).sort();
	if (JSON.stringify(Object.keys(components).sort()) !== JSON.stringify(ids))
		throw new Error('Documentation must cover exactly every public component export.');
	const colocated = (await readdir(sourceRoot, { recursive: true })).filter(
		(file) => /(^|\/)docs\.ts$/.test(file) && file !== 'types/docs.ts'
	);
	if (JSON.stringify(colocated.map((file) => file.split('/')[0]).sort()) !== JSON.stringify(ids))
		throw new Error('Each public component needs one colocated docs.ts default export.');
	for (const { id } of publicExports) {
		const doc = components[id];
		if (!doc.description?.trim() || !doc.usage?.trim() || !Array.isArray(doc.props))
			throw new Error(`${id}: description, usage and props are required.`);
		if (!/```svelte\n[\s\S]+?```/.test(doc.usage))
			throw new Error(`${id}: usage needs a complete fenced Svelte example.`);
		if (Object.keys(doc).some((key) => !['description', 'usage', 'props'].includes(key)))
			throw new Error(
				`${id}: installation metadata and extra reference fields do not belong in docs.ts.`
			);
		const names = new Set();
		for (const prop of doc.props) {
			if (
				!prop.name?.trim() ||
				!prop.type?.trim() ||
				!prop.description?.trim() ||
				names.has(prop.name)
			)
				throw new Error(`${id}: props need unique names, types and descriptions.`);
			names.add(prop.name);
		}
		const source = await readFile(new URL(`${id}/docs.ts`, sourceRoot), 'utf8');
		if (!/export default/.test(source) || !/satisfies ComponentDocProps/.test(source))
			throw new Error(`${id}: docs.ts must default-export data satisfying ComponentDocProps.`);
	}
	for (const entry of registry.values()) {
		if (entry.files.some((file) => /(^|\/)docs\.[jt]s$/.test(file)))
			throw new Error(`${entry.id}: reference data must not be copied with component sources.`);
		for (const file of entry.files) {
			const content = await readFile(`${entry.directory}/${file}`, 'utf8');
			if (/from\s+['"][^'"]*\bdocs(?:\.js|\.ts|\/|['"])/.test(content))
				throw new Error(`${entry.id}: component runtime imports documentation.`);
		}
	}
};

/** Discover component names from the public barrel rather than duplicating a component list. */
export const publicComponents = (source) => {
	const ast = ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest, true);
	return ast.statements.filter(ts.isExportDeclaration).flatMap((statement) =>
		statement.exportClause && ts.isNamedExports(statement.exportClause)
			? statement.exportClause.elements
					.filter((element) => element.propertyName?.text === 'default')
					.map((element) => ({
						name: element.name.text,
						id: element.name.text.replace(
							/[A-Z]/g,
							(letter, position) => `${position ? '-' : ''}${letter.toLowerCase()}`
						)
					}))
			: []
	);
};

/** Resolve public type aliases/re-exports and their owning component files for generated imports. */
export const publicTypes = (file) => {
	const program = ts.createProgram([file], {
		module: ts.ModuleKind.NodeNext,
		moduleResolution: ts.ModuleResolutionKind.NodeNext
	});
	const checker = program.getTypeChecker();
	const module = checker.getSymbolAtLocation(program.getSourceFile(file));
	return checker
		.getExportsOfModule(module)
		.filter((symbol) => !(symbol.flags & ts.SymbolFlags.Value))
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
};
