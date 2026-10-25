/**
 * Read and parse the consumer project's bref.config.json file.
 * @param projectRoot Directory containing the consumer project's configuration.
 * @returns The configuration file path and parsed JSON value.
 * @throws When the file cannot be read or contains invalid JSON.
 */
export const readConfigFile = async (
	projectRoot: string
): Promise<{ configPath: string; config: unknown }> => {
	const configPath = `${projectRoot}/bref.config.json`;
	const config: unknown = await Bun.file(configPath).json();
	return { configPath, config };
};
