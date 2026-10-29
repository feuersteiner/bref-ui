import type { RegistryEntry } from '../../registry/types.js';

/**
 * Build missing default re-exports using each component's source folder name.
 * @param entries Validated dependency-first registry entries.
 * @param existing Export names already present; updated as additions are planned.
 * @returns Missing export statements in entry and manifest order.
 * @throws When a requested name already refers to another export.
 */
export const createAdditions = (
	entries: RegistryEntry[],
	existing: Map<string, string | null>
): string[] => {
	return entries.flatMap((entry) => {
		const directory = entry.directory.split('/').filter(Boolean).at(-1);
		return Object.entries(entry.exports).flatMap(([name, file]) => {
			const module = `./${directory}/${file}`;
			if (existing.has(name)) {
				if (existing.get(name) === module) return [];
				throw new Error(`index.ts: export "${name}" conflicts with "${module}".`);
			}
			existing.set(name, module);
			return [`export { default as ${name} } from ${JSON.stringify(module)};`];
		});
	});
};
