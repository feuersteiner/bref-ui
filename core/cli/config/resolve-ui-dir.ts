import { readImportAliases } from './imports/index.js';

/**
 * Resolve the directory receiving copied components from the #bref/* subpath import.
 * @param projectRoot Consumer project directory containing package.json.
 * @returns The normalized absolute directory mapped by "#bref/*": "./<directory>/*".
 * @throws When package.json cannot be read or parsed, or declares no directory-shaped
 * "#bref/*" import.
 */
export const resolveUiDir = async (projectRoot: string): Promise<string> => {
	const directory = (await readImportAliases(projectRoot))['#bref'];
	if (directory === undefined)
		throw new Error('package.json: missing "#bref/*" import. Run bref-ui init.');

	const path = Bun.fileURLToPath(Bun.pathToFileURL(`${projectRoot}/${directory}`));
	return path.replace(/(?<=.)\/$/, '');
};
