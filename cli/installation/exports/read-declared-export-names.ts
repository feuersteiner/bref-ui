import ts from 'typescript';
import type { ExistingExport } from './types.js';
import { readBindingNames } from './utils.js';

/**
 * Reserve names defined by exported variables, functions, classes and type declarations.
 * These declarations are not default re-exports of installed component files, so their
 * component paths are always null. Default declarations reserve the name default.
 * @param statement Parsed top-level declaration or another statement to ignore.
 * @returns Declared public names, including destructured variables, or an empty list.
 */
export const readDeclaredExportNames = (statement: ts.Statement): ExistingExport[] => {
	if (!ts.canHaveModifiers(statement)) return [];
	const modifiers = ts.getModifiers(statement);
	if (!modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) return [];
	if (modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword))
		return [{ name: 'default', componentPath: null }];

	if (ts.isVariableStatement(statement))
		return statement.declarationList.declarations.flatMap((declaration) =>
			readBindingNames(declaration.name).map((name) => ({ name, componentPath: null }))
		);

	if (
		(ts.isFunctionDeclaration(statement) ||
			ts.isClassDeclaration(statement) ||
			ts.isInterfaceDeclaration(statement) ||
			ts.isTypeAliasDeclaration(statement) ||
			ts.isEnumDeclaration(statement) ||
			ts.isModuleDeclaration(statement)) &&
		statement.name
	)
		return [{ name: statement.name.text, componentPath: null }];

	return [];
};
