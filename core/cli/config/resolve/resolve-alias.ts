/**
 * Find the longest configured alias prefix matching a UI path.
 * @param ui Configured UI alias, optionally followed by a subdirectory.
 * @param aliases Project alias mappings that override the default $lib mapping.
 * @returns The matching alias and its destination mapping.
 * @throws When no alias matches the configured UI location.
 */
export const resolveAlias = (ui: string, aliases: Record<string, string>): [string, string] => {
	const mappings = Object.entries({ $lib: 'src/lib', ...aliases }).sort(
		([left], [right]) => right.length - left.length
	);
	const match = mappings.find(([alias]) => ui === alias || ui.startsWith(`${alias}/`));

	if (!match) throw new Error(`Cannot resolve UI alias "${ui}".`);

	return match;
};
