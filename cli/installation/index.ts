import type { RegistryEntry } from '../registry/types.js';
import { copyFiles } from './copy/index.js';
import { prepareExports } from './exports/index.js';
import { prepareSource } from './prepare/index.js';
import { previewChanges } from './preview/index.js';
import type { PreviewChange } from './types.js';

/**
 * Prepare component sources and index.ts, review their changes, then copy approved files.
 * No destination files are written until review accepts the complete preview.
 * @param entries Validated dependency-first entries returned by planDependencies.
 * @param destination Absolute consumer UI directory.
 * @param review Receive the preview and return approved relative overwrite paths,
 * including index.ts when it conflicts. Return an empty list to accept without
 * overwrites, or null to cancel the installation without writing files.
 * @returns installed after copying completes, or cancelled when review returns null.
 * Identical files are skipped; accepting an unchanged installation returns installed.
 * @throws When preparation, preview or review fails, or a conflict lacks approval.
 * Copy failures propagate and may leave some files copied; writes are not atomic.
 */
export const installComponent = async (
	entries: RegistryEntry[],
	destination: string,
	review: (changes: PreviewChange[]) => Promise<string[] | null>
): Promise<'installed' | 'cancelled'> => {
	const sources = await prepareSource(entries);
	const exports = await prepareExports(entries, destination);
	const files = [...sources, exports];
	const changes = await previewChanges(files, destination);
	const overwrites = await review(changes);
	if (overwrites === null) return 'cancelled';

	await copyFiles(files, destination, overwrites);
	return 'installed';
};
