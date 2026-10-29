import type { RegistryEntry } from '../types.js';

/**
 * Index entries while enforcing globally unique component IDs and export names.
 * @param entries Loaded entries in discovery order.
 * @returns A catalogue keyed by component ID, preserving entry order.
 * @throws When a component ID or export name appears more than once.
 */
export const createRegistry = (entries: RegistryEntry[]): Map<string, RegistryEntry> => {
	const exports = new Set<string>();

	return entries.reduce((registry, entry) => {
		const manifest = `${entry.directory}/registry.json`;
		if (registry.has(entry.id))
			throw new Error(`${manifest}: duplicate component ID "${entry.id}".`);

		Object.keys(entry.exports).forEach((name) => {
			if (exports.has(name)) throw new Error(`${manifest}: duplicate component export "${name}".`);
			exports.add(name);
		});

		registry.set(entry.id, entry);
		return registry;
	}, new Map<string, RegistryEntry>());
};
