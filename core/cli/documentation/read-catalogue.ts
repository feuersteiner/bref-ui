import { readFile } from 'node:fs/promises';
import type { DocumentationCatalogue } from './types.js';

/** Read the bundled reference without accessing the consumer project or network. */
export const readCatalogue = async (): Promise<DocumentationCatalogue> =>
	JSON.parse(await readFile(new URL('../docs.json', import.meta.url), 'utf8'));
