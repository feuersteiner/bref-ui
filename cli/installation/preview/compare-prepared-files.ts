import type { PreparedFile, PreviewChange } from '../types.js';
import type { DestinationFile } from './types.js';

/**
 * Compare each prepared file with the destination result at the same position.
 * @param files Prepared sources in caller order.
 * @param existingFiles Destination results in the same order as files.
 * @returns Addition, unchanged or conflict statuses in prepared-file order.
 */
export const comparePreparedFiles = (
	files: PreparedFile[],
	existingFiles: DestinationFile[]
): PreviewChange[] =>
	files.map(({ path, content }, index) => {
		const existing = existingFiles[index];
		if (!existing.exists) return { path, status: 'add' };
		return { path, status: existing.content === content ? 'unchanged' : 'conflict' };
	});
