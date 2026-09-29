import type { PreparedFile } from '../types.js';
import type { DestinationFile } from './types.js';

/**
 * Read destination files concurrently while preserving prepared-file order.
 * @param files Prepared files whose destination paths should be inspected.
 * @param destination Consumer project's configured UI directory.
 * @returns Existing contents, or a missing marker, for each prepared file.
 * @throws When a destination file cannot be read for a reason other than ENOENT.
 */
export const readDestinationFiles = async (
	files: PreparedFile[],
	destination: string
): Promise<DestinationFile[]> =>
	Promise.all(
		files.map(async ({ path }): Promise<DestinationFile> => {
			try {
				return { path, exists: true, content: await Bun.file(`${destination}/${path}`).text() };
			} catch (error) {
				if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
					return { path, exists: false };
				throw error;
			}
		})
	);
