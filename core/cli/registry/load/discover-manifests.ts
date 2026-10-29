import { existsSync, readdirSync } from 'node:fs';

/**
 * Find registry manifests one folder below the source root.
 * @param sourceRoot Directory to scan.
 * @returns Sorted manifest paths prefixed with the source root.
 */
export const discoverManifests = (sourceRoot: string): string[] =>
	readdirSync(sourceRoot, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => `${sourceRoot}/${entry.name}/registry.json`)
		.filter(existsSync)
		.sort();
