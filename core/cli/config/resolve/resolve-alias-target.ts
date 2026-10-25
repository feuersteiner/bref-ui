/**
 * Resolve an alias match to a normalized absolute filesystem path.
 * @param projectRoot Base directory for relative alias targets.
 * @param ui Configured UI alias, optionally followed by a subdirectory.
 * @param alias Matching alias prefix.
 * @param target Directory mapped from the alias.
 * @returns The normalized absolute destination path, without accessing the filesystem.
 */
export const resolveAliasTarget = (
	projectRoot: string,
	ui: string,
	alias: string,
	target: string
): string => {
	const directory = target.startsWith('/') ? target : `${projectRoot}/${target}`;
	return Bun.fileURLToPath(Bun.pathToFileURL(`${directory}${ui.slice(alias.length)}`));
};
