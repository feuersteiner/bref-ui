import { readFile, stat } from 'node:fs/promises';
import type { RegistryEntry } from '../types.js';
import { parseItem } from './utils.js';

/**
 * Read a manifest, validate its metadata and check that listed files exist.
 * @param manifest Path to a component's registry.json.
 * @returns Validated metadata with its containing directory.
 * @throws When the manifest cannot be read, metadata is invalid or a file is missing.
 */
export const loadEntry = async (manifest: string): Promise<RegistryEntry> => {
	const item = parseItem(JSON.parse(await readFile(manifest, 'utf8')), manifest);
	const directory = manifest.slice(0, -'/registry.json'.length);

	await Promise.all(
		item.files.map(async (file) => {
			if (!(await stat(`${directory}/${file}`).catch(() => null))?.isFile())
				throw new Error(`${manifest}: missing file "${file}".`);
		})
	);

	return { ...item, directory };
};
