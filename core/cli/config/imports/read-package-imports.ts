import { readFile } from 'node:fs/promises';

/**
 * Read the imports field from the consumer project's package.json file.
 * @param projectRoot Directory containing the consumer project's package.json.
 * @returns The unvalidated imports value, or undefined when package.json is absent,
 * its root is not an object or it declares no imports.
 * @throws When package.json exists but cannot be read or contains invalid JSON.
 */
export const readPackageImports = async (projectRoot: string): Promise<unknown> => {
	let content: string;
	try {
		content = await readFile(`${projectRoot}/package.json`, 'utf8');
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return undefined;
		throw error;
	}
	const manifest: unknown = JSON.parse(content);
	if (typeof manifest !== 'object' || manifest === null || !('imports' in manifest))
		return undefined;

	return manifest.imports;
};
