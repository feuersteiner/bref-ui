import type { PreviewChange } from '../../installation/types.js';
import { confirm } from './utils.js';

/**
 * Request an individual approval for each conflicting file in preview order.
 * @param changes Full preview; additions and identical files need no overwrite approval.
 * @returns Approved relative paths, or null on the first declined or closed prompt.
 * No further prompts are shown after cancellation and no files are written.
 * @throws When reading a confirmation fails.
 */
export const approveOverwrites = (changes: PreviewChange[]): string[] | null =>
	changes
		.filter(({ status }) => status === 'conflict')
		.reduce<string[] | null>((approved, { path }) => {
			if (approved === null) return null;
			return confirm(`Overwrite ${path}?`) ? [...approved, path] : null;
		}, []);
