import { expect, test } from 'vitest';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cli, fixture, snapshot } from './cli-fixture.js';

test('help succeeds and invalid arguments fail without modifying the consumer', async () => {
	const directory = await fixture();
	const before = await snapshot(directory);
	for (const args of [[], ['--help'], ['init', '--help'], ['add', '-h']])
		expect(cli(directory, args)).toContain('Usage: bref-ui');
	for (const args of [['unknown'], ['add'], ['init', 'extra'], ['add', '--unknown']])
		expect(cli(directory, args, '', 1)).toContain('Expected init or add <component>');
	expect(await snapshot(directory)).toEqual(before);
});

test.each([
	[{}, './src/lib/ui'],
	[{ '#lib/*': './custom/*', '#other': './other.js' }, './custom/ui']
])('init preserves the manifest and uses the configured library path: %j', async (imports, ui) => {
	const manifest = { imports, scripts: { dev: 'vite' }, description: 'Keep this field' };
	const directory = await fixture(manifest);
	expect(cli(directory, ['init'])).toContain('Added #bref imports');
	const initialized = await readFile(join(directory, 'package.json'), 'utf8');
	expect(JSON.parse(initialized)).toEqual({
		name: 'cli-consumer',
		private: true,
		...manifest,
		imports: { ...imports, '#bref': `${ui}/index.js`, '#bref/*': `${ui}/*` }
	});
	expect(cli(directory, ['init'])).toContain('already declares #bref');
	expect(await readFile(join(directory, 'package.json'), 'utf8')).toBe(initialized);
	cli(directory, ['add', 'button'], 'y\n');
	expect((await snapshot(directory))[`${ui.slice(2)}/button/button.svelte`]).toBeDefined();
});

test('init preserves existing #bref imports byte for byte', async () => {
	const directory = await fixture({ imports: { '#bref/*': './existing/*' } });
	const before = await snapshot(directory);
	expect(cli(directory, ['init'])).toContain('already declares #bref');
	expect(await snapshot(directory)).toEqual(before);
});

test('add fails without initialization or for unknown components without writing files', async () => {
	const directory = await fixture();
	const before = await snapshot(directory);
	expect(cli(directory, ['add', 'button'], '', 1)).toContain('Run bref-ui init');
	expect(await snapshot(directory)).toEqual(before);
	cli(directory, ['init']);
	const initialized = await snapshot(directory);
	expect(cli(directory, ['add', 'not-a-component'], '', 1)).toContain('Unknown registry component');
	expect(await snapshot(directory)).toEqual(initialized);
});

test('add button copies dependencies and package type imports; rerunning changes no bytes', async () => {
	const directory = await fixture();
	cli(directory, ['init']);
	expect(cli(directory, ['add', 'button'], 'y\n')).toContain('Installed button');
	const files = await snapshot(directory);
	const ui = 'src/lib/ui/';
	expect(Object.keys(files).sort()).toEqual(
		[
			'package.json',
			...[
				'button/button.svelte',
				'icon/icon.svelte',
				'index.ts',
				'theme/cli-theme.svelte',
				'theme/colors.svelte',
				'theme/fonts.css',
				'theme/fonts.svelte',
				'theme/glass.svelte',
				'theme/styles.svelte',
				'theme/surface.ts',
				'theme/surfaces.svelte'
			].map((path) => `${ui}${path}`)
		].sort()
	);
	expect(files[`${ui}button/button.svelte`]).toContain("from 'bref-ui/types'");
	expect(files[`${ui}index.ts`].trim().split('\n').sort()).toEqual([
		'export { default as Button } from "./button/button.svelte";',
		'export { default as Icon } from "./icon/icon.svelte";',
		'export { default as Theme } from "./theme/cli-theme.svelte";'
	]);
	const output = cli(directory, ['add', 'button'], 'yes\n');
	expect(output).toContain('unchanged: button/button.svelte');
	expect(output).not.toContain('Overwrite');
	expect(await snapshot(directory)).toEqual(files);
});

test.each(['\n', 'no\n', ''])('cancelled add writes nothing for input %j', async (input) => {
	const directory = await fixture();
	cli(directory, ['init']);
	const before = await snapshot(directory);
	expect(cli(directory, ['add', 'button'], input)).toContain('Installation cancelled');
	expect(await snapshot(directory)).toEqual(before);
});

test('conflicting sources and index require separate approvals before any writes', async () => {
	const directory = await fixture();
	cli(directory, ['init']);
	cli(directory, ['add', 'button'], 'y\n');
	const installed = await snapshot(directory);
	await writeFile(join(directory, 'src/lib/ui/button/button.svelte'), '<button>Custom</button>\n');
	await writeFile(join(directory, 'src/lib/ui/index.ts'), 'export const custom = true;\n');
	const modified = await snapshot(directory);
	for (const input of ['n\n', 'y\nn\n', 'y\ny\nn\n']) {
		expect(cli(directory, ['add', 'button'], input)).toContain('Installation cancelled');
		expect(await snapshot(directory)).toEqual(modified);
	}
	const output = cli(directory, ['add', 'button'], 'y\ny\ny\n');
	expect(output).toContain('Overwrite button/button.svelte?');
	expect(output).toContain('Overwrite index.ts?');
	expect(output).toContain('Installed button');
	const accepted = await snapshot(directory);
	expect(accepted['src/lib/ui/button/button.svelte']).toBe(
		installed['src/lib/ui/button/button.svelte']
	);
	expect(accepted['src/lib/ui/index.ts']).toContain('export const custom = true;');
	expect(accepted['src/lib/ui/index.ts']).toContain('default as Button');
});
