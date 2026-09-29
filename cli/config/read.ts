import type { BrefConfig } from './types.js';

/**
 * Read bref.config.json, defaulting the UI alias to $lib/ui when omitted.
 * @param projectRoot Directory containing the consumer project's configuration.
 * @returns The supported configuration values with defaults applied.
 * @throws When the file cannot be read or parsed, the root is not an object,
 * or the supplied UI alias is not a string.
 */
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
