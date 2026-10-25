import { normalizeConfig } from './normalize-config.js';
import { readConfigFile } from './read-config-file.js';
import type { BrefConfig } from '../types.js';

/**
 * Read bref.config.json, defaulting the UI alias to $lib/ui when omitted.
 * @param projectRoot Directory containing the consumer project's configuration.
 * @returns The supported configuration values with defaults applied.
 * @throws When the file cannot be read or parsed, the root is not an object,
 * or the supplied UI alias is not a string.
 */
export const readConfig = async (projectRoot: string): Promise<BrefConfig> => {
	const { configPath, config } = await readConfigFile(projectRoot);
	return normalizeConfig(configPath, config);
};
