/**
 * Resolve a UI alias using the longest matching alias prefix.
 * Supplied mappings override the default $lib mapping to src/lib.
 * @param projectRoot Base directory for relative alias targets.
 * @param ui Configured UI alias, optionally followed by a subdirectory.
 * @param aliases Project alias mappings to relative or absolute directories.
 * @returns The normalized absolute destination path, without accessing the filesystem.
 * @throws When no alias matches the configured UI location.
 */
export const resolveTargetDir = (
	projectRoot: string,
	ui: string,
	aliases: Record<string, string> = {}
): string => {
	const mappings = Object.entries({ $lib: 'src/lib', ...aliases }).sort(
		([left], [right]) => right.length - left.length
	);
	const match = mappings.find(([alias]) => ui === alias || ui.startsWith(`${alias}/`));

	if (!match) throw new Error(`Cannot resolve UI alias "${ui}".`);

	const [alias, target] = match;
	const directory = target.startsWith('/') ? target : `${projectRoot}/${target}`;
	return Bun.fileURLToPath(Bun.pathToFileURL(`${directory}${ui.slice(alias.length)}`));
};
