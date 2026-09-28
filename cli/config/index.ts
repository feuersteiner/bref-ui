import type { BrefConfig } from './types.js';

export const readConfig = async (projectRoot: string): Promise<BrefConfig> => {
	const configPath = `${projectRoot}/bref.config.json`;
	const config: unknown = await Bun.file(configPath).json();

	if (typeof config !== 'object' || config === null || Array.isArray(config))
		throw new Error(`${configPath}: expected a JSON object.`);

	if ('ui' in config) {
		if (typeof config.ui !== 'string') throw new Error(`${configPath}: "ui" must be a string.`);

		return { ui: config.ui };
	}

	return { ui: '$lib/ui' };
};
