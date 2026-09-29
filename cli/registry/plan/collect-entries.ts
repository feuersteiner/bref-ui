import type { RegistryEntry } from '../types.js';

/**
 * Collect dependency entries before their dependent component.
 * @param id Component ID to collect.
 * @param registry Catalogue to resolve IDs against.
 * @param planned Component IDs already included in this plan's traversal.
 * @returns Ordered entries, or an empty list when the component was already included.
 * @throws When the component ID is absent from the catalogue.
 */
export const collectEntries = (
	id: string,
	registry: Map<string, RegistryEntry>,
	planned: Set<string>
): RegistryEntry[] => {
	if (planned.has(id)) return [];

	const entry = registry.get(id);
	if (!entry) throw new Error(`Unknown registry component "${id}".`);

	planned.add(id);
	return [
		...entry.dependencies.flatMap((dependencyId) =>
			collectEntries(dependencyId, registry, planned)
		),
		entry
	];
};
