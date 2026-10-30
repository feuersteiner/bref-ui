import { expect, test } from 'vitest';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { cli, fixture, snapshot } from './cli-fixture.js';

const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('packed docs discover all components and read offline without a project or prompts', async () => {
	const directory = await fixture();
	await unlink(join(directory, 'package.json'));
	const before = await snapshot(directory);
	const list = cli(directory, ['docs', 'list'], '', 0, 'node');
	expect(list).toContain(`bref-ui v${version}`);
	expect(list.match(/^- /gm)).toHaveLength(20);
	expect(list).toContain('button (Button; package + copy)');
	expect(list).toContain('theme-mode-toggle (ThemeModeToggle; package only)');
	for (const args of [
		['docs', 'cli'],
		['docs', 'button'],
		['docs', 'theme-mode-toggle']
	])
		expect(cli(directory, args, '', 0, 'node')).toContain(`bref-ui v${version}`);
	const usage = cli(directory, ['docs', 'button', 'usage'], '', 0, 'node');
	expect(usage).toContain('<Button');
	expect(usage).not.toContain('## Props');
	expect(usage).not.toContain('Copied components');
	const props = cli(directory, ['docs', 'dialog', 'props'], '', 0, 'node');
	expect(props).toContain('header: DialogHeaderDataProps; required');
	expect(props).toContain('open: boolean; optional; default: false; bindable');
	expect(props).not.toContain('<Dialog');
	const install = cli(directory, ['docs', 'button', 'cli'], '', 0, 'node');
	expect(install).toContain('npx bref-ui add button');
	expect(install).toContain('theme, icon, button');
	expect(install).toContain("from '#bref'");
	expect(install).toContain("from 'bref-ui/types'");
	expect(install).toContain('ButtonProps');
	expect(install).not.toContain('## Usage');
	expect(install).not.toContain('docs.ts');
	expect(cli(directory, ['docs', 'theme-mode-toggle', 'cli'], '', 0, 'node')).toContain(
		'Package only; no copy command'
	);
	expect(await snapshot(directory)).toEqual(before);
});

test('invalid documentation commands fail with actionable errors without writing files', async () => {
	const directory = await fixture();
	const before = await snapshot(directory);
	for (const args of [['docs'], ['docs', 'button', 'extra', 'more'], ['docs', '--unknown']])
		expect(cli(directory, args, '', 1, 'node')).toContain('Expected docs list');
	for (const section of ['all', 'unknown', '--help'])
		expect(cli(directory, ['docs', 'button', section], '', 1, 'node')).toContain(
			'Use usage, props or cli'
		);
	for (const id of ['missing', '__proto__', 'Button'])
		expect(cli(directory, ['docs', id], '', 1, 'node')).toContain('Run bref-ui docs list');
	for (const target of ['list', 'cli'])
		expect(cli(directory, ['docs', target, 'usage'], '', 1, 'node')).toContain('takes no section');
	expect(cli(directory, ['skills', 'list'], '', 1, 'node')).toContain('Use --help');
	expect(await snapshot(directory)).toEqual(before);
});

test.each(['npx', 'pnpm'])(
	'packed %s documentation reads use installed metadata offline',
	async (manager) => {
		const directory = await fixture({}, manager);
		expect(cli(directory, ['docs', 'button', 'props'], '', 0, manager)).toContain('label: string');
	}
);

test('an app built from the packed CLI usage reference compiles in a clean consumer', async () => {
	const directory = await fixture({ type: 'module' });
	const usage = cli(directory, ['docs', 'button', 'usage']);
	const source = usage.match(/```svelte\n([\s\S]*?)```/)[1];
	await writeFile(join(directory, 'app.svelte'), source);
	await writeFile(
		join(directory, 'main.js'),
		"import { mount } from 'svelte'; import App from './app.svelte'; mount(App, { target: document.body });"
	);
	await writeFile(
		join(directory, 'index.html'),
		'<!doctype html><html><body><script type="module" src="/main.js"></script></body></html>'
	);
	const result = await build({
		root: directory,
		configFile: false,
		logLevel: 'silent',
		plugins: [svelte({ configFile: false })],
		build: { write: false }
	});
	expect(result.output.some((file) => file.type === 'chunk' && file.isEntry)).toBe(true);
});
