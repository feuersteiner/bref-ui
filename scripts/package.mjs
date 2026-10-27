import { copyFile } from 'node:fs/promises';

const targets = new Map([
	['-c', 'core'],
	['-t', 'themes']
]);
const target = targets.get(process.argv[2]);
if (!target || process.argv.length !== 3)
	throw new Error('Usage: node scripts/package.mjs <-c|-t>');

// Keep published package metadata identical to the repository originals.
await Promise.all(
	(target === 'core' ? ['readme.md', 'LICENSE'] : ['LICENSE']).map((name) =>
		copyFile(
			new URL(`../${name}`, import.meta.url),
			new URL(`../${target}/${name}`, import.meta.url)
		)
	)
);
