import { readConfig } from '../../config/read/index.js';
import { resolveTargetDir } from '../../config/resolve/index.js';
import { installComponent } from '../../installation/index.js';
import { loadRegistry } from '../../registry/load/index.js';
import { planDependencies } from '../../registry/plan/index.js';
import { reviewChanges } from './review-changes.js';

/**
 * Install a component and its dependencies after reviewing changes in the terminal.
 * @param componentId Registry ID of the requested component.
 * @param projectRoot Consumer project directory containing bref.config.json.
 * @param sourceRoot Directory containing canonical component folders and manifests.
 * @param aliases Project alias mappings; supplied values override the default $lib mapping.
 * @returns installed after accepted changes are copied, or cancelled when any
 * confirmation is declined or input closes. Cancellation writes no files.
 * @throws When configuration, alias resolution, registry loading, planning or
 * installation fails. Copy failures may leave partial writes and are not rolled back.
 */
export const addComponent = async (
	componentId: string,
	projectRoot: string,
	sourceRoot: string,
	aliases: Record<string, string> = {}
): Promise<'installed' | 'cancelled'> => {
	const config = await readConfig(projectRoot);
	const destination = resolveTargetDir(projectRoot, config.ui, aliases);
	const registry = await loadRegistry(sourceRoot);
	const entries = planDependencies(componentId, registry);
	return installComponent(entries, destination, reviewChanges);
};
