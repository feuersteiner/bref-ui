import { parseScript } from '../parser/index.js';
import { readExportedNames } from './read-exported-names.js';

/**
 * Collect public names and matching direct default re-export module paths.
 * Null marks a different export form or a duplicate name that cannot be reused.
 * @param content Existing index.ts content, parsed without changing its formatting.
 * @returns Export names mapped to their reusable component module or null.
 * @throws Invalid script syntax or an unresolved wildcard re-export.
 */
export const collectExports = (content: string): Map<string, string | null> => {
	const { statements } = parseScript(content, 'index.ts');
	return statements.reduce((exports, statement) => {
		readExportedNames(statement).forEach(({ name, componentPath }) => {
			exports.set(name, exports.has(name) ? null : componentPath);
		});
		return exports;
	}, new Map<string, string | null>());
};
