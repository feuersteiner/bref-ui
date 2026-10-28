import type { AST } from 'svelte/compiler';

/** Top-level ESTree statement returned by Svelte's TypeScript-aware parser. */
export type ScriptStatement = AST.Script['content']['body'][number];

/** Parsed statements and the position adjustment for the synthetic script wrapper. */
export interface ParsedScript {
	/** Statements from the original script, including TypeScript declarations. */
	statements: ScriptStatement[];
	/** Prefix length to subtract from corrected module positions to address original text. */
	offset: number;
}
