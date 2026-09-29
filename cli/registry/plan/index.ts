import type { RegistryEntry } from '../types.js';
import { collectEntries } from './collect-entries.js';

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
): RegistryEntry[] => collectEntries(componentId, registry, new Set<string>());
