import type { RegistryEntry } from './types.js';

/**
 * Resolve a component and its dependencies without accessing the filesystem.
 * @param componentId Component requested for installation.
 * @param registry Validated catalogue returned by loadRegistry.
 * @returns Unique entries in dependency-first order, preserving declared dependency order.
 * @throws When the requested component or a dependency is absent from the catalogue.
 */
export const planDependencies = (
	componentId: string,
	registry: Map<string, RegistryEntry>
): RegistryEntry[] => {
	/** Component IDs already included in this plan's traversal. */
	const planned = new Set<string>();

	/**
	 * Collect dependency entries before their dependent component.
	 * @param id Component ID to collect.
	 * @returns Ordered entries, or an empty list when the component was already included.
	 * @throws When the component ID is absent from the catalogue.
	 */
	const collectEntries = (id: string): RegistryEntry[] => {
		if (planned.has(id)) return [];

		const entry = registry.get(id);
		if (!entry) throw new Error(`Unknown registry component "${id}".`);

		planned.add(id);
		return [...entry.dependencies.flatMap(collectEntries), entry];
	};

	return collectEntries(componentId);
};
