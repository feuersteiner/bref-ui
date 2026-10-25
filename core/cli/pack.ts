import { loadRegistry } from './registry/load/index.js';

/** Validate the canonical registry before assembling the local package. */
const sourceRoot = Bun.fileURLToPath(new URL('../src/lib/', import.meta.url));
const registry = await loadRegistry(sourceRoot);
console.log(`Validated ${registry.size} registry entries for packaging.`);
