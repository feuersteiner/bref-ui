import type { Command } from './types.js';

/**
 * Validate supported command arguments without reading or writing project files.
 * @param args Arguments after the executable filename.
 * @returns A help, init or add request. No arguments also requests help.
 * @throws When a command is unknown, arguments are missing or extra, or an
 * unsupported option is supplied.
 */
export const parse = (args: string[]): Command => {
	const [name, componentId] = args;
	if (
		args.length === 0 ||
		(args.length === 1 && ['help', '--help', '-h'].includes(name)) ||
		(args.length === 2 && ['init', 'add'].includes(name) && ['--help', '-h'].includes(componentId))
	)
		return { name: 'help' };

	if (name === 'init' && args.length === 1) return { name: 'init' };
	if (name === 'add' && args.length === 2 && componentId.length > 0 && !componentId.startsWith('-'))
		return { name: 'add', componentId };

	throw new Error('Expected init or add <component>. Use --help for usage.');
};
