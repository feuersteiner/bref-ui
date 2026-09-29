/**
 * Read the destination index, treating only a missing file as empty content.
 * @param destination Consumer UI directory.
 * @returns Existing content or an empty string for ENOENT.
 * @throws Any other filesystem read error.
 */
export const readIndex = async (destination: string): Promise<string> => {
	try {
		return await Bun.file(`${destination}/index.ts`).text();
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return '';
		throw error;
	}
};
