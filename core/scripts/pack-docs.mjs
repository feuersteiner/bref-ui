import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { componentDocs } from '../.svelte-kit/reference/docs/index.js';
import { loadRegistry } from '../dist-cli/registry/load/index.js';
import { installationReference } from './installation-reference.mjs';
import { validateDocs, publicComponents, publicTypes } from './validate-docs.mjs';
import { validateExamples } from './validate-examples.mjs';

const sourceRoot = new URL('../src/lib/', import.meta.url);
const registry = await loadRegistry(fileURLToPath(sourceRoot));
const publicExports = publicComponents(await readFile(new URL('index.ts', sourceRoot), 'utf8'));
await validateDocs(componentDocs, publicExports, registry, sourceRoot);
await validateExamples(componentDocs);
const types = publicTypes(fileURLToPath(new URL('types.ts', sourceRoot)));
const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const cli = await readFile(new URL('../cli/documentation/cli.md', import.meta.url), 'utf8');
const components = Object.fromEntries(
	publicExports.map(({ id, name }) => [
		id,
		{
			name,
			...componentDocs[id],
			...installationReference(id, name, componentDocs[id], registry, types)
		}
	])
);
await writeFile(
	new URL('../dist-cli/docs.json', import.meta.url),
	JSON.stringify({ version, cli, components })
);
console.log(
	`Bundled documentation for ${publicExports.length} public components (bref-ui v${version}).`
);
