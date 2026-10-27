import { copyFile } from 'node:fs/promises';

await Promise.all([
	copyFile(new URL('../LICENSE', import.meta.url), new URL('../core/LICENSE', import.meta.url)),
	copyFile(new URL('../LICENSE', import.meta.url), new URL('../themes/LICENSE', import.meta.url)),
	copyFile(new URL('../readme.md', import.meta.url), new URL('../core/readme.md', import.meta.url))
]);
