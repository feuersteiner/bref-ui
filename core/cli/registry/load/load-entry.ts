import type { RegistryEntry } from '../types.js';
import { parseItem } from './utils.js';

/**
 * Read a manifest, validate its metadata and check that listed files exist.
 * @param manifest Path to a component's registry.json.
 * @returns Validated metadata with its containing directory.
 * @throws When the manifest cannot be read, metadata is invalid or a file is missing.
 */
export const loadEntry = async (manifest: string): Promise<RegistryEntry> => {
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
