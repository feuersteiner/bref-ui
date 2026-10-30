import type { DocumentationCatalogue } from './types.js';

/** Format the shared prop reference, preserving conditional requirements and bindings. */
export const formatProps = (props: DocumentationCatalogue['components'][string]['props']): string =>
	props
		.map(
			(prop) =>
				`- ${prop.name}: ${prop.type}${prop.required ? `; required${typeof prop.required === 'string' ? ` (${prop.required})` : ''}` : '; optional'}${prop.default === undefined ? '' : `; default: ${prop.default}`}${prop.bindable ? '; bindable' : ''}\n  ${prop.description}`
		)
		.join('\n');
