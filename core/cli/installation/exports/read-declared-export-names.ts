import type { ScriptStatement } from '../parser/types.js';
import type { ExistingExport } from './types.js';
import { readBindingNames, readName } from './utils.js';

/**
 * Reserve names defined by exported variables, functions, classes and type declarations.
 * These declarations have no reusable component path; default declarations reserve default.
 * @param statement Parsed top-level declaration or another statement to ignore.
 * @returns Declared public names, including destructured variables, or an empty list.
 */
export const readDeclaredExportNames = (statement: ScriptStatement): ExistingExport[] => {
	if (statement.type === 'ExportDefaultDeclaration')
		return [{ name: 'default', componentPath: null }];
	if (statement.type !== 'ExportNamedDeclaration' || !statement.declaration) return [];

	const declaration = statement.declaration;
	if (declaration.type === 'VariableDeclaration')
		return declaration.declarations.flatMap(({ id }) =>
			readBindingNames(id).map((name) => ({ name, componentPath: null }))
		);

	const name = 'id' in declaration ? readName(declaration.id) : null;
	return name === null ? [] : [{ name, componentPath: null }];
};
