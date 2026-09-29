import type { PreparedFile, PreviewChange } from './types.js';

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
): Promise<PreviewChange[]> =>
	Promise.all(
		files.map(async ({ path, content }): Promise<PreviewChange> => {
			try {
				const existing = await Bun.file(`${destination}/${path}`).text();
				return { path, status: existing === content ? 'unchanged' : 'conflict' };
			} catch (error) {
				if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
					return { path, status: 'add' };
				throw error;
			}
		})
	);
