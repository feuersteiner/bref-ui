import type { PreviewChange } from '../../installation/types.js';
import { approveOverwrites } from './approve-overwrites.js';
import { displayChanges } from './display-changes.js';
import { confirm } from './utils.js';

/**
 * Show the full preview, collect overwrite approvals and confirm installation.
 * @param changes Prepared source and index.ts changes relative to the UI directory.
 * @returns Approved conflicting paths, or null if any confirmation is declined
 * or input closes. An empty list accepts changes that need no overwrites.
 * @throws When terminal output or prompting fails; destination files remain untouched.
 */
export const reviewChanges = async (changes: PreviewChange[]): Promise<string[] | null> => {
	displayChanges(changes);
	const overwrites = approveOverwrites(changes);
	if (overwrites === null) return null;
	return confirm('Install these changes?') ? overwrites : null;
};
