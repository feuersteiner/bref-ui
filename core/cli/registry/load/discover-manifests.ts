/**
 * Find registry manifests one folder below the source root.
 * @param sourceRoot Directory to scan.
 * @returns Sorted manifest paths prefixed with the source root.
 */
export const discoverManifests = (sourceRoot: string): string[] =>
	Array.from(new Bun.Glob('*/registry.json').scanSync({ cwd: sourceRoot }))
		.sort()
		.map((path) => `${sourceRoot}/${path}`);
