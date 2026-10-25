import type { RegistryEntry } from '../../registry/types.js';
import type { PreparedFile } from '../types.js';
import { readIndex } from './read-index.js';
import { collectExports } from './collect-exports.js';
import { createAdditions } from './create-additions.js';
import { mergeContent } from './merge-content.js';

/**
 * Prepare missing component re-exports while preserving the existing index.ts text.
 * Matching direct default re-exports are skipped; other uses of their names conflict.
 * @param entries Validated, dependency-first entries returned by planDependencies.
 * @param destination Absolute consumer UI directory containing index.ts.
 * @returns The prepared index.ts for the existing preview and copy stages; no writes occur.
 * @throws When reading or parsing fails, an export name conflicts, or a wildcard
 * export prevents determining which names are already exported.
 */
export const prepareExports = async (
	entries: RegistryEntry[],
	destination: string
): Promise<PreparedFile> => {
	const content = await readIndex(destination);
	if (entries.length === 0) return { path: 'index.ts', content };

	const existing = collectExports(content);
	const additions = createAdditions(entries, existing);
	return { path: 'index.ts', content: mergeContent(content, additions) };
};
