import type { ExportAllDeclaration, ExportNamedDeclaration } from 'estree';
import type { ExistingExport } from './types.js';
import { readDefaultReExportPath, readName } from './utils.js';

/**
 * Read public aliases from export lists and namespace re-exports.
 * Direct runtime default re-exports record their module path; other names reserve a null path.
 * @param declaration Parsed export list, namespace re-export or wildcard re-export.
 * @returns Export records in source order.
 * @throws For export * without a namespace, because its names are unknown here.
 */
export const readReExportedNames = (
	declaration: ExportNamedDeclaration | ExportAllDeclaration
): ExistingExport[] => {
	if (declaration.type === 'ExportAllDeclaration') {
		const name = readName(declaration.exported);
		if (name === null) throw new Error('index.ts: wildcard exports must be made explicit first.');
		return [{ name, componentPath: null }];
	}
	return declaration.specifiers.map((specifier) => ({
		name: readName(specifier.exported)!,
		componentPath: readDefaultReExportPath(declaration, specifier)
	}));
};
