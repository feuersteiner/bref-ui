import { parseScript } from '../parser/index.js';

/**
 * Replace only the module text of relative, type-only imports.
 * @param content Script content to parse as TypeScript.
 * @param filename Source path included in preparation errors.
 * @returns Script text preserving import syntax, quotes, formatting and runtime imports.
 * @throws When syntax is invalid or a relative non-component import mixes type and value specifiers.
 */
export const rewriteImports = (content: string, filename: string): string => {
	const { statements, offset } = parseScript(content, filename);
	return statements.reduceRight((source, statement) => {
		if (statement.type !== 'ImportDeclaration' || typeof statement.source.value !== 'string')
			return source;

		const module = statement.source;
		const path = module.value as string;
		if (!/^\.{1,2}\//.test(path) || path.endsWith('.svelte')) return source;
		const specifiers = statement.specifiers;
		if (specifiers.length === 0) return source;

		const namedTypes = specifiers.filter((item) => item.type === 'ImportSpecifier');
		const onlyTypes =
			('importKind' in statement && statement.importKind === 'type') ||
			(namedTypes.length === specifiers.length &&
				namedTypes.every((item) => 'importKind' in item && item.importKind === 'type'));
		if (!onlyTypes) {
			if (namedTypes.some((item) => 'importKind' in item && item.importKind === 'type'))
				throw new Error(`${filename}: separate type and value imports from "${path}".`);
			return source;
		}

		const { start, end } = module as typeof module & { start: number; end: number };
		return source.slice(0, start - offset + 1) + 'bref-ui/types' + source.slice(end - offset - 1);
	}, content);
};
