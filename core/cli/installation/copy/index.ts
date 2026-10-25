import { previewChanges } from '../preview/index.js';
import type { PreparedFile } from '../types.js';
import { validateOverwriteApprovals } from './validate-overwrite-approvals.js';
import { writePreparedFiles } from './write-prepared-files.js';

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
	validateOverwriteApprovals(changes, overwrites);
	await writePreparedFiles(files, changes, destination);
};
