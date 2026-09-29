import ts from 'typescript';
import { readReExportedNames } from './read-reexported-names.js';
import { readDeclaredExportNames } from './read-declared-export-names.js';
import type { ExistingExport } from './types.js';

/**
 * Identify the public names introduced by one top-level index.ts statement.
 * A matching component path lets installation reuse an existing default re-export;
 * a null path reserves the name and prevents installation from replacing it.
 * @param statement Parsed statement, such as a re-export or an exported declaration.
 * @returns Named records for its exports, or an empty list when it exports no names.
 * @throws For export *, whose names cannot be known without inspecting another file.
 */
export const readExportedNames = (statement: ts.Statement): ExistingExport[] => {
	if (ts.isExportDeclaration(statement)) return readReExportedNames(statement);
	return readDeclaredExportNames(statement);
};
