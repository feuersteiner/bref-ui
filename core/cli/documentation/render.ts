import { formatProps } from './format-props.js';
import type { DocumentationCatalogue, DocumentationSection } from './types.js';

/** Render only the requested reference; reject unknown IDs with a discovery command. */
export const render = (
	catalogue: DocumentationCatalogue,
	target: string,
	section?: DocumentationSection
): string => {
	const header = `# bref-ui v${catalogue.version}`;
	if (target === 'list')
		return (
			`${header}\n\n` +
			Object.entries(catalogue.components)
				.map(
					([id, doc]) =>
						`- ${id} (${doc.name}; ${doc.copyable ? 'package + copy' : 'package only'}): ${doc.description}`
				)
				.join('\n')
		);
	if (target === 'cli') return `${header}\n\n${catalogue.cli}`;
	const doc = catalogue.components[target];
	if (!Object.hasOwn(catalogue.components, target))
		throw new Error(`Unknown component "${target}". Run bref-ui docs list for component IDs.`);
	const title = `${header} — ${target}`;
	if (section === 'usage') return `${title}\n\n${doc.usage}`;
	if (section === 'props') return `${title}\n\n${formatProps(doc.props)}`;
	if (section === 'cli') return `${title}\n\n${doc.installation}`;
	return `${title}\n\n${doc.description}\n\n## Usage\n\n${doc.usage}\n\n## Props\n\n${formatProps(doc.props)}\n\n## CLI\n\n${doc.installation}`;
};
