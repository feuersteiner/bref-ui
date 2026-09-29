import type { RegistryEntry } from '../types.js';
import { parseItem } from './utils.js';

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

/**
 * Find registry manifests one folder below the source root.
 * @param sourceRoot Directory to scan.
 * @returns Sorted manifest paths prefixed with the source root.
 */
const discoverManifests = (sourceRoot: string): string[] =>
	Array.from(new Bun.Glob('*/registry.json').scanSync({ cwd: sourceRoot }))
		.sort()
		.map((path) => `${sourceRoot}/${path}`);

/**
 * Read a manifest, validate its metadata and check that listed files exist.
 * @param manifest Path to a component's registry.json.
 * @returns Validated metadata with its containing directory.
 * @throws When the manifest cannot be read, metadata is invalid or a file is missing.
 */
const loadEntry = async (manifest: string): Promise<RegistryEntry> => {
	const item = parseItem(await Bun.file(manifest).json(), manifest);
	const directory = manifest.slice(0, -'/registry.json'.length);

	await Promise.all(
		item.files.map(async (file) => {
			if (!(await Bun.file(`${directory}/${file}`).exists()))
				throw new Error(`${manifest}: missing file "${file}".`);
		})
	);

	return { ...item, directory };
};

/**
 * Index entries while enforcing globally unique component IDs and export names.
 * @param entries Loaded entries in discovery order.
 * @returns A catalogue keyed by component ID, preserving entry order.
 * @throws When a component ID or export name appears more than once.
 */
const createRegistry = (entries: RegistryEntry[]): Map<string, RegistryEntry> => {
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

/**
 * Traverse dependency chains to reject missing components and cycles.
 * @param registry Catalogue to validate; its entries and order remain unchanged.
 * @throws When a dependency ID is unknown or a dependency chain is circular.
 */
const validateDependencies = (registry: Map<string, RegistryEntry>): void => {
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
