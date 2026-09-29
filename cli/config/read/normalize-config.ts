import type { BrefConfig } from '../types.js';

/**
 * Validate the supported configuration field and apply its default.
 * @param configPath Path used to report configuration validation errors.
 * @param config Parsed configuration JSON value.
 * @returns The supported configuration values with defaults applied.
 * @throws When the root is not an object or the supplied UI alias is not a string.
 */
export const normalizeConfig = (configPath: string, config: unknown): BrefConfig => {
	if (typeof config !== 'object' || config === null || Array.isArray(config))
		throw new Error(`${configPath}: expected a JSON object.`);

	if ('ui' in config) {
		if (typeof config.ui !== 'string') throw new Error(`${configPath}: "ui" must be a string.`);

		return { ui: config.ui };
	}

	return { ui: '$lib/ui' };
};
