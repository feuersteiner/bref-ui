import { parse } from 'svelte/compiler';
import { rewriteImports } from './rewrite-imports.js';

/**
 * Rewrite imports only within scripts, preserving markup, CSS and all other text.
 * @param content Original file content.
 * @param filename Source path used to select the parser and report errors.
 * @returns Content with local type module specifiers replaced.
 * @throws When Svelte parsing or import preparation fails.
 */
export const rewriteSource = (content: string, filename: string): string => {
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
