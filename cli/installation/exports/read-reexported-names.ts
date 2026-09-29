import ts from 'typescript';
import type { ExistingExport } from './types.js';
import { readDefaultReExportPath } from './utils.js';

/**
 * Read public aliases from export lists and namespace re-exports.
 * For example, export { default as Button } from './button.svelte' records Button
 * with its module path; other exports record their names with a null path.
 * @param declaration Parsed export {...}, export * as Name, or export * statement.
 * @returns One record per exported name, preserving the export list's order.
 * @throws For export * without a namespace, because its names are unknown here.
 */
export const readReExportedNames = (declaration: ts.ExportDeclaration): ExistingExport[] => {
	const clause = declaration.exportClause;
	if (!clause) throw new Error('index.ts: wildcard exports must be made explicit first.');
	if (ts.isNamespaceExport(clause)) return [{ name: clause.name.text, componentPath: null }];

	return clause.elements.map((specifier) => ({
		name: specifier.name.text,
		componentPath: readDefaultReExportPath(declaration, specifier)
	}));
};
