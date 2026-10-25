import { resolveAlias } from './resolve-alias.js';
import { resolveAliasTarget } from './resolve-alias-target.js';

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
	const [alias, target] = resolveAlias(ui, aliases);
	return resolveAliasTarget(projectRoot, ui, alias, target);
};
