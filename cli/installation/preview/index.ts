import type { PreparedFile, PreviewChange } from '../types.js';
import { comparePreparedFiles } from './compare-prepared-files.js';
import { readDestinationFiles } from './read-destination-files.js';

/**
 * Compare prepared sources with destination files without writing changes.
 * @param files Prepared files with paths relative to the destination directory.
 * @param destination Consumer project's configured UI directory.
 * @returns Addition, unchanged or conflict statuses in prepared-file order.
 * @throws When an existing destination file cannot be read.
 */
export const previewChanges = async (
	files: PreparedFile[],
	destination: string
): Promise<PreviewChange[]> => {
	const existingFiles = await readDestinationFiles(files, destination);
	return comparePreparedFiles(files, existingFiles);
};
