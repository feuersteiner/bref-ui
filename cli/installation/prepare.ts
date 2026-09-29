import { parse } from 'svelte/compiler';
import ts from 'typescript';
import type { RegistryEntry } from '../registry/types.js';
import type { PreparedFile } from './types.js';

/**
 * Read planned sources and redirect local type imports to bref-ui/types.
 * @param entries Dependency-first entries returned by planDependencies.
 * @returns Prepared files in entry and manifest order, retaining source folder names.
 * @throws When a file cannot be read or parsed, or a local import mixes types and values.
 */
export const prepareSource = async (entries: RegistryEntry[]): Promise<PreparedFile[]> => {
	const files = entries.flatMap((entry) =>
		entry.files.map((file) => ({
			source: `${entry.directory}/${file}`,
			path: `${entry.directory.split('/').filter(Boolean).at(-1)}/${file}`
		}))
	);

	return Promise.all(
		files.map(async ({ source, path }) => ({
			path,
			content: rewriteSource(await Bun.file(source).text(), source)
		}))
	);
};

/**
 * Rewrite imports only within scripts, preserving markup, CSS and all other text.
 * @param content Original file content.
 * @param filename Source path used to select the parser and report errors.
 * @returns Content with local type module specifiers replaced.
 * @throws When Svelte parsing or import preparation fails.
 */
const rewriteSource = (content: string, filename: string): string => {
	if (!filename.endsWith('.svelte'))
		return /\.[cm]?[jt]s$/.test(filename) ? rewriteImports(content, filename) : content;

	const component = parse(content, { filename, modern: true });
	const scripts = [component.module, component.instance]
		.filter((script) => script !== null && script !== undefined)
		.map((script) => script.content as typeof script.content & { start: number; end: number })
		.sort((left, right) => right.start - left.start);

	return scripts.reduce((source, script) => {
		const { start, end } = script;
		return (
			source.slice(0, start) +
			rewriteImports(source.slice(start, end), filename) +
			source.slice(end)
		);
	}, content);
};

/**
 * Replace only the module text of relative, type-only imports.
 * @param content Script content to parse as TypeScript.
 * @param filename Source path included in preparation errors.
 * @returns Script text preserving import syntax, quotes, formatting and runtime imports.
 * @throws When a relative non-component import mixes type and value specifiers.
 */
const rewriteImports = (content: string, filename: string): string => {
	const script = ts.createSourceFile(
		filename,
		content,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	);

	return script.statements.reduceRight((source, statement) => {
		if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
			return source;

		const module = statement.moduleSpecifier;
		if (!/^\.{1,2}\//.test(module.text) || module.text.endsWith('.svelte')) return source;

		const clause = statement.importClause;
		if (!clause) return source;

		const bindings = clause.namedBindings;
		const namedTypes = bindings && ts.isNamedImports(bindings) && bindings.elements;
		const onlyTypes =
			clause.isTypeOnly ||
			(!clause.name &&
				namedTypes &&
				namedTypes.length > 0 &&
				namedTypes.every((item) => item.isTypeOnly));

		if (!onlyTypes) {
			if (namedTypes && namedTypes.some((item) => item.isTypeOnly))
				throw new Error(`${filename}: separate type and value imports from "${module.text}".`);
			return source;
		}

		return (
			source.slice(0, module.getStart(script) + 1) + 'bref-ui/types' + source.slice(module.end - 1)
		);
	}, content);
};
