import { resolveUiDir } from '../../config/resolve-ui-dir.js';
import { installComponent } from '../../installation/index.js';
import { loadRegistry } from '../../registry/load/index.js';
import { planDependencies } from '../../registry/plan/index.js';
import { reviewChanges } from './review-changes.js';

/**
 * Install a component and its dependencies after reviewing changes in the terminal.
 * @param componentId Registry ID of the requested component.
 * @param projectRoot Consumer project directory whose package.json declares "#bref/*".
 * @param sourceRoot Directory containing canonical component folders and manifests.
 * @returns installed after accepted changes are copied, or cancelled when any
 * confirmation is declined or input closes. Cancellation writes no files.
 * @throws When package.json or the "#bref/*" import, registry loading, planning or
 * installation fails. Copy failures may leave partial writes and are not rolled back.
 */
export const addComponent = async (
	componentId: string,
	projectRoot: string,
	sourceRoot: string
): Promise<'installed' | 'cancelled'> => {
	const destination = await resolveUiDir(projectRoot);
	const registry = await loadRegistry(sourceRoot);
	const entries = planDependencies(componentId, registry);
	return installComponent(entries, destination, reviewChanges);
};
