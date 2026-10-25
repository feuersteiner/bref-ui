import { copyFile } from 'node:fs/promises';

// Keep the published package's license identical to the repository original.
await copyFile(
	new URL('../LICENSE', import.meta.url),
	new URL('../themes/LICENSE', import.meta.url)
);
