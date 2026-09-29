import type { RegistryEntry } from '../../registry/types.js';
import type { PreparedFile } from '../types.js';
import { collectSourceFiles } from './collect-source-files.js';
import { readSourceFiles } from './read-source-files.js';

/**
 * Read planned sources and redirect local type imports to bref-ui/types.
 * @param entries Dependency-first entries returned by planDependencies.
 * @returns Prepared files in entry and manifest order, retaining source folder names.
 * @throws When a file cannot be read or parsed, or a local import mixes types and values.
 */
export const prepareSource = async (entries: RegistryEntry[]): Promise<PreparedFile[]> => {
	const sources = collectSourceFiles(entries);
	return readSourceFiles(sources);
};
