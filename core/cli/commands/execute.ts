import { fileURLToPath } from 'node:url';
import { addComponent } from './add/index.js';
import { initImports } from './init-imports.js';
import { readDocumentation } from '../documentation/index.js';
import type { Command } from './types.js';

/**
 * Run a validated request and print its outcome using the registry shipped beside the executable.
 * @param command Parsed help, init, add or docs request.
 * @param projectRoot Consumer project directory, supplied by the executable's cwd.
 * @throws When initialization or installation fails; the executable reports the error.
 */
export const execute = async (command: Command, projectRoot: string): Promise<void> => {
	if (command.name === 'help') {
		console.log(
			'Usage: bref-ui <command>\n\n' +
				'Commands:\n' +
				'  init             Add the #bref UI imports to package.json\n' +
				'  add <component>  Preview and install a component and its dependencies\n\n' +
				'  docs list        Discover public components and copy availability\n' +
				'  docs cli         Read the CLI workflow\n' +
				'  docs <component> [usage|props|cli]  Read a component reference\n\n' +
				'Options:\n' +
				'  -h, --help       Show this help\n\n' +
				'init/add use the current directory as the consumer project. docs reads bundled references offline.'
		);
		return;
	}
	if (command.name === 'docs') {
		await readDocumentation(command.target, command.section);
		return;
	}
	if (command.name === 'init') {
		const result = await initImports(projectRoot);
		console.log(
			result === 'created'
				? 'Added #bref imports to package.json.'
				: 'package.json already declares #bref imports.'
		);
		return;
	}

	const sourceRoot = fileURLToPath(new URL('../../src/lib/', import.meta.url));
	const result = await addComponent(command.componentId, projectRoot, sourceRoot);
	console.log(
		result === 'installed'
			? `Installed ${command.componentId} and its dependencies.`
			: 'Installation cancelled.'
	);
};
