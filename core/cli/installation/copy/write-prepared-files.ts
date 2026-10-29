import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
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
			if (status === 'add' && existsSync(target))
				throw new Error(`Destination appeared after preview for "${path}".`);
			await mkdir(dirname(target), { recursive: true });
			await writeFile(target, content, { flag: status === 'add' ? 'wx' : 'w' });
		})
	).then(() => undefined);
