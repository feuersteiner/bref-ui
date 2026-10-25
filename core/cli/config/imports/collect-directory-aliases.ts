/**
 * Convert directory-shaped subpath import patterns, such as "#lib/*": "./src/lib/*",
 * into alias mappings relative to the project root.
 * @param imports Unvalidated package.json imports value.
 * @returns Aliases without their trailing /* mapped to project-relative directories.
 * Exact entries, suffixed patterns, arrays, null targets and conditional targets
 * without a string default are skipped because they do not name a single directory.
 */
export const collectDirectoryAliases = (imports: unknown): Record<string, string> => {
	if (typeof imports !== 'object' || imports === null || Array.isArray(imports)) return {};

	return Object.fromEntries(
		Object.entries(imports).flatMap(([key, value]) => {
			const target =
				typeof value === 'object' && value !== null && 'default' in value ? value.default : value;
			const alias = key.slice(0, -2);
			const directory = typeof target === 'string' ? /^\.\/(?:([^*]+)\/)?\*$/.exec(target) : null;
			if (!key.startsWith('#') || !key.endsWith('/*') || alias.includes('*') || !directory)
				return [];

			return [[alias, directory[1] ?? '.']];
		})
	);
};
