import { collectDirectoryAliases } from './collect-directory-aliases.js';
import { readPackageImports } from './read-package-imports.js';

/**
 * Discover directory aliases from the consumer's package.json subpath imports,
 * such as the SvelteKit 3 "#lib/*": "./src/lib/*" mapping, without executing project config.
 * @param projectRoot Directory containing the consumer project's package.json.
 * @returns Alias mappings to project-relative directories; empty when package.json
 * is absent or declares no directory-shaped imports.
 * @throws When package.json exists but cannot be read or contains invalid JSON.
 */
export const readImportAliases = async (projectRoot: string): Promise<Record<string, string>> => {
	const imports = await readPackageImports(projectRoot);
	return collectDirectoryAliases(imports);
};
