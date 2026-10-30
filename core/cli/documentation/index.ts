import { readCatalogue } from './read-catalogue.js';
import { render } from './render.js';
import type { DocumentationSection } from './types.js';

/** Print a versioned reference without initialization, prompts, project access or writes. */
export const readDocumentation = async (
	target: string,
	section?: DocumentationSection
): Promise<void> => {
	const catalogue = await readCatalogue();
	console.log(render(catalogue, target, section));
};
