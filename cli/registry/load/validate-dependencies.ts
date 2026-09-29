import type { RegistryEntry } from '../types.js';

/**
 * Traverse dependency chains to reject missing components and cycles.
 * @param registry Catalogue to validate; its entries and order remain unchanged.
 * @throws When a dependency ID is unknown or a dependency chain is circular.
 */
export const validateDependencies = (registry: Map<string, RegistryEntry>): void => {
	/** Component IDs in the current recursive dependency chain. */
	const visiting = new Set<string>();
	/** Component IDs whose dependency chains have already passed validation. */
	const visited = new Set<string>();

	/**
	 * Validate one component and its dependencies, skipping completed checks.
	 * @param id Component ID to visit.
	 * @throws When the ID is missing or already belongs to the active chain.
	 */
	const visit = (id: string): void => {
		if (visiting.has(id)) throw new Error(`Circular registry dependency at "${id}".`);
		if (visited.has(id)) return;

		const entry = registry.get(id);
		if (!entry) throw new Error(`Unknown registry dependency "${id}".`);

		visiting.add(id);
		entry.dependencies.forEach(visit);
		visiting.delete(id);
		visited.add(id);
	};

	registry.forEach((entry) => visit(entry.id));
};
