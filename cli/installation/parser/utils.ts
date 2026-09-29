import type { ScriptStatement } from './types.js';

/**
 * Escape literal closing script tags so the synthetic HTML wrapper cannot truncate JavaScript.
 * @param content Original script; Unicode escapes keep string-literal values unchanged.
 * @returns Parser text and original positions of the expanded less-than characters.
 */
export const escapeClosingTags = (content: string): { content: string; positions: number[] } => ({
	content: content.replace(/<(?=\/script\s*>)/g, '\\u003c'),
	positions: [...content.matchAll(/<(?=\/script\s*>)/g)].map((match) => match.index)
});

/**
 * Undo escape expansion for import/export module positions used by source rewriting.
 * @param statements Locally parsed statements; only their module literals need original positions.
 * @param positions Original escaped character positions, before the wrapper prefix.
 * @param prefix Length of the synthetic script prefix.
 * @returns Statements with module start/end positions corrected; literal values stay unchanged.
 */
export const restoreModulePositions = (
	statements: ScriptStatement[],
	positions: number[],
	prefix: number
): ScriptStatement[] =>
	statements.map((statement) => {
		if (!('source' in statement) || !statement.source) return statement;
		const module = statement.source as typeof statement.source & { start: number; end: number };
		module.start = restorePosition(module.start, positions, prefix);
		module.end = restorePosition(module.end, positions, prefix);
		return statement;
	});

/**
 * Remove the five extra characters inserted by each earlier Unicode escape.
 * @param position Position reported in the wrapped and escaped parser input.
 * @param positions Original escaped character positions.
 * @param prefix Wrapper prefix length, retained for the caller's final adjustment.
 * @returns Position before escape expansion, still including the wrapper prefix.
 */
const restorePosition = (position: number, positions: number[], prefix: number): number =>
	position -
	positions.reduce(
		(count, start, index) => count + (start + prefix + index * 5 < position ? 5 : 0),
		0
	);
