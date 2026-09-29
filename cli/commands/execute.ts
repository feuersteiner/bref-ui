import { addComponent } from './add/index.js';
import { initConfig } from './init.js';
import type { Command } from './types.js';

/**
 * Run a validated request and print its outcome using the source checkout's registry.
 * @param command Parsed help, init or add request.
 * @param projectRoot Consumer project directory, supplied by the executable's cwd.
 * @throws When initialization or installation fails; the executable reports the error.
 */
export const execute = async (command: Command, projectRoot: string): Promise<void> => {
	if (command.name === 'help') {
		console.log(
			'Usage: bun <path-to-cli>/index.ts <command>\n\n' +
				'Commands:\n' +
				'  init             Create bref.config.json with the default UI alias\n' +
				'  add <component>  Preview and install a component and its dependencies\n\n' +
				'Options:\n' +
				'  -h, --help       Show this help\n\n' +
				'Commands use the current directory as the consumer project.'
		);
		return;
	}
	if (command.name === 'init') {
		const result = await initConfig(projectRoot);
		console.log(
			result === 'created' ? 'Created bref.config.json.' : 'bref.config.json already exists.'
		);
		return;
	}

	const sourceRoot = Bun.fileURLToPath(new URL('../../src/lib/', import.meta.url));
	const result = await addComponent(command.componentId, projectRoot, sourceRoot);
	console.log(
		result === 'installed'
			? `Installed ${command.componentId} and its dependencies.`
			: 'Installation cancelled.'
	);
};
