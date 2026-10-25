/**
 * Create bref.config.json with the default UI alias when the file is absent.
 * @param projectRoot Existing consumer project directory.
 * @returns created after writing the default configuration, or exists when a
 * configuration file is already present. Existing contents are not read or changed.
 * @throws When checking or writing the configuration fails, including a missing
 * project directory. The existence check and write are not atomic; concurrent
 * initialization of the same project is unsupported.
 */
export const initConfig = async (projectRoot: string): Promise<'created' | 'exists'> => {
	const config = Bun.file(`${projectRoot}/bref.config.json`);
	if (await config.exists()) return 'exists';

	const content = `${JSON.stringify({ ui: '$lib/ui' }, null, '\t')}\n`;
	await Bun.write(config, content, { createPath: false });
	return 'created';
};
