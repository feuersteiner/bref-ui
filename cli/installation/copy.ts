import { previewChanges } from './preview.js';
import type { PreparedFile } from './types.js';

/**
 * Copy prepared files after checking every conflict against explicit approvals.
 * Call only after the user accepts the preview; cancellation must skip this call.
 * Checks and writes are not atomic; avoid concurrent edits to the destination.
 * @param files Prepared files with paths relative to the destination directory.
 * @param destination Consumer project's configured UI directory.
 * @param overwrites Relative file paths explicitly approved for overwriting.
 * @returns Completion after all required writes; identical files are skipped.
 * @throws Before writing when any conflict lacks approval, or when previewing fails.
 * @throws If an addition appears before its write, or a write fails; some files may be copied.
 */
export const copyFiles = async (
	files: PreparedFile[],
	destination: string,
	overwrites: string[] = []
): Promise<void> => {
	const changes = await previewChanges(files, destination);
	const approved = new Set(overwrites);
	const conflict = changes.find(({ path, status }) => status === 'conflict' && !approved.has(path));

	if (conflict) throw new Error(`Overwrite approval required for "${conflict.path}".`);

	await Promise.all(
		files.map(async ({ path, content }, index) => {
			const { status } = changes[index];
			if (status === 'unchanged') return;

			const target = `${destination}/${path}`;
			if (status === 'add' && (await Bun.file(target).exists()))
				throw new Error(`Destination appeared after preview for "${path}".`);
			await Bun.write(target, content, { createPath: true });
		})
	);
};
