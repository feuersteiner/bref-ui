import type { Command } from './types.js';
import type { DocumentationSection } from '../documentation/types.js';

/**
 * Validate supported command arguments without reading or writing project files.
 * @param args Arguments after the executable filename.
 * @returns A help, init, add or docs request. No arguments also requests help.
 * @throws When a command is unknown, arguments are missing or extra, or an
 * unsupported option is supplied.
 */
export const parse = (args: string[]): Command => {
	const [name, componentId] = args;
	if (
		args.length === 0 ||
		(args.length === 1 && ['help', '--help', '-h'].includes(name)) ||
		(args.length === 2 &&
			['init', 'add', 'docs'].includes(name) &&
			['--help', '-h'].includes(componentId))
	)
		return { name: 'help' };

	if (name === 'init' && args.length === 1) return { name: 'init' };
	if (name === 'add' && args.length === 2 && componentId.length > 0 && !componentId.startsWith('-'))
		return { name: 'add', componentId };
	if (name === 'docs') {
		if (!componentId || componentId.startsWith('-') || args.length > 3)
			throw new Error('Expected docs list, docs cli or docs <component> [usage|props|cli].');
		const section = args[2];
		if (['list', 'cli'].includes(componentId) && section !== undefined)
			throw new Error(`docs ${componentId} takes no section. Use bref-ui docs ${componentId}.`);
		if (section !== undefined && !['usage', 'props', 'cli'].includes(section))
			throw new Error(
				`Unknown docs section "${section}". Use usage, props or cli; omit it for the full reference.`
			);
		return {
			name: 'docs',
			target: componentId,
			section: section as DocumentationSection | undefined
		};
	}

	throw new Error(
		'Expected init or add <component>, or docs <component|list|cli>. Use --help for usage.'
	);
};
