import type { PreviewChange } from '../types.js';

/**
 * Reject the first conflicting path that has no explicit overwrite approval.
 * @param changes Preview results in prepared-file order.
 * @param overwrites Relative paths explicitly approved for overwriting.
 * @returns Nothing when every conflict is approved.
 * @throws When a conflict lacks overwrite approval.
 */
export const validateOverwriteApprovals = (
	changes: PreviewChange[],
	overwrites: string[]
): void => {
	const approved = new Set(overwrites);
	const conflict = changes.find(({ path, status }) => status === 'conflict' && !approved.has(path));

	if (conflict) throw new Error(`Overwrite approval required for "${conflict.path}".`);
};
