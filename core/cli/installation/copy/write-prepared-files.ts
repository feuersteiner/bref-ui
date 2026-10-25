import type { PreparedFile, PreviewChange } from '../types.js';

/**
 * Write additions and approved conflicts, skipping identical destination files.
 * @param files Prepared files in the same order as changes.
 * @param changes Preview results for these files.
 * @param destination Consumer project's configured UI directory.
 * @returns Completion after all required writes.
 * @throws If an addition appears before its write or a write fails; some files may be copied.
 */
export const writePreparedFiles = async (
	files: PreparedFile[],
	changes: PreviewChange[],
	destination: string
): Promise<void> =>
	Promise.all(
		files.map(async ({ path, content }, index) => {
			const { status } = changes[index];
			if (status === 'unchanged') return;

			const target = `${destination}/${path}`;
			if (status === 'add' && (await Bun.file(target).exists()))
				throw new Error(`Destination appeared after preview for "${path}".`);
			await Bun.write(target, content, { createPath: true });
		})
	).then(() => undefined);
