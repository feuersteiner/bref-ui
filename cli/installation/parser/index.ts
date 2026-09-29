import { parse } from 'svelte/compiler';
import type { ParsedScript } from './types.js';
import { escapeClosingTags, restoreModulePositions } from './utils.js';

/**
 * Parse standalone script text with Svelte's existing TypeScript-aware parser.
 * A synthetic module script exposes imports and exports without compiling or changing text.
 * @param content Original JavaScript or TypeScript text.
 * @param filename Source path used in syntax errors.
 * @returns Top-level statements and the wrapper offset for corrected module positions.
 * @throws When the script contains invalid syntax or syntax unsupported by Svelte's parser.
 */
export const parseScript = (content: string, filename: string): ParsedScript => {
	const prefix = '<script module lang="ts">';
	const escaped = escapeClosingTags(content);
	try {
		const component = parse(`${prefix}${escaped.content}\n</script>`, { filename, modern: true });
		const statements = restoreModulePositions(
			component.module!.content.body,
			escaped.positions,
			prefix.length
		);
		return { statements, offset: prefix.length };
	} catch (error) {
		throw new Error(`${filename}: ${error instanceof Error ? error.message : String(error)}`, {
			cause: error
		});
	}
};
