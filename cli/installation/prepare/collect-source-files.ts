import type { RegistryEntry } from '../../registry/types.js';
import type { SourceFile } from './types.js';

/**
 * Build source and destination-relative paths in dependency and manifest order.
 * @param entries Dependency-first entries returned by planDependencies.
 * @returns Each source path paired with its destination-relative path.
 */
export const collectSourceFiles = (entries: RegistryEntry[]): SourceFile[] =>
	entries.flatMap((entry) =>
		entry.files.map((file) => ({
			source: `${entry.directory}/${file}`,
			path: `${entry.directory.split('/').filter(Boolean).at(-1)}/${file}`
		}))
	);
