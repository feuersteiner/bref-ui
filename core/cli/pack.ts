import { fileURLToPath } from 'node:url';
import { copyFile } from 'node:fs/promises';
import { loadRegistry } from './registry/load/index.js';

/** Validate the canonical registry before assembling the local package. */
const sourceRoot = fileURLToPath(new URL('../src/lib/', import.meta.url));
const registry = await loadRegistry(sourceRoot);
console.log(`Validated ${registry.size} registry entries for packaging.`);
await Promise.all(
	['readme.md', 'LICENSE'].map((name) =>
		copyFile(new URL(`../../${name}`, import.meta.url), new URL(`../${name}`, import.meta.url))
	)
);
