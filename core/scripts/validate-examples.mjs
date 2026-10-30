import { mkdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { compile } from 'svelte/compiler';

/** Compile and type-check every complete usage example against the public package API. */
export const validateExamples = async (components) => {
	const directory = new URL('../.svelte-kit/reference-examples/', import.meta.url);
	await rm(directory, { recursive: true, force: true });
	await mkdir(directory, { recursive: true });
	let count = 0;
	for (const [id, doc] of Object.entries(components))
		for (const [, source] of doc.usage.matchAll(/```svelte\n([\s\S]*?)```/g)) {
			const filename = `${id}-${count++}.svelte`;
			compile(source, { filename, generate: 'server' });
			await writeFile(new URL(filename, directory), source);
		}

	await writeFile(
		new URL('tsconfig.json', directory),
		JSON.stringify({
			compilerOptions: {
				target: 'ES2022',
				module: 'NodeNext',
				moduleResolution: 'NodeNext',
				strict: true,
				allowJs: true,
				checkJs: true,
				skipLibCheck: true,
				allowImportingTsExtensions: true,
				noEmit: true,
				lib: ['ES2022', 'DOM'],
				types: ['svelte', 'vite/client']
			},
			include: ['*.svelte', '../../src/**/*.svelte', '../../src/**/*.d.ts']
		})
	);
	const result = spawnSync(
		process.execPath,
		[
			fileURLToPath(new URL('../node_modules/svelte-check/bin/svelte-check', import.meta.url)),
			'--workspace',
			fileURLToPath(new URL('../', import.meta.url)),
			'--tsconfig',
			fileURLToPath(new URL('tsconfig.json', directory)),
			'--fail-on-warnings'
		],
		{ encoding: 'utf8' }
	);
	if (result.error || result.status !== 0)
		throw new Error(
			`Documentation example validation failed:\n${result.stdout}\n${result.stderr}`,
			{ cause: result.error }
		);
	console.log(`Validated ${count} documentation examples against the public Svelte API.`);
};
