import type { RegistryEntry } from '../types.js';
import { createRegistry } from './create-registry.js';
import { discoverManifests } from './discover-manifests.js';
import { loadEntry } from './load-entry.js';
import { validateDependencies } from './validate-dependencies.js';

/**
 * Load and validate the component catalogue without writing files.
 * @param sourceRoot Directory containing immediate component folders.
 * @returns Entries keyed by component ID, in sorted manifest-path order.
 * @throws When manifests cannot be read, metadata or files are invalid,
 * IDs or exports collide, or dependencies are missing or circular.
 */
export const loadRegistry = async (sourceRoot: string): Promise<Map<string, RegistryEntry>> => {
	const manifests = discoverManifests(sourceRoot);
	const entries = await Promise.all(manifests.map(loadEntry));
	const registry = createRegistry(entries);
	validateDependencies(registry);

	return registry;
};
