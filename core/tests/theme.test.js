import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { paletteStyle } from '../../themes/src/lib/theme/palette.js';

const root = resolve(import.meta.dirname, '../..');
const themes = ['crystal-code', 'glassy', 'new-paris', 'vscode'];
let server;
let render;

beforeAll(async () => {
	server = await createServer({
		root: resolve(root, 'core'),
		configFile: false,
		plugins: [svelte({ configFile: false })],
		server: { middlewareMode: true, watch: null },
		appType: 'custom'
	});
	({ render } = await server.ssrLoadModule('svelte/server'));
});
afterAll(async () => server?.close());

const load = async (theme) =>
	(await server.ssrLoadModule(`/@fs/${root}/themes/src/lib/${theme}/theme.svelte`)).default;

const renderTheme = async (theme, props = {}) => render(await load(theme), { props });

test.each(themes)(
	'%s keeps its default palette and omits global palette overrides',
	async (theme) => {
		const output = await renderTheme(theme);
		expect(output.body).toContain(`data-bref-theme="${theme}"`);
		expect(output.body).not.toContain('style=');
		expect(output.head).not.toContain('--color-');
		const source = await readFile(resolve(root, `themes/src/lib/${theme}/theme.svelte`), 'utf8');
		// Lock all semantic defaults for both modes.
		expect(
			Object.fromEntries(
				[...source.matchAll(/--color-([\w-]+): (#[\da-f]+);/g)].map(([, role, value]) => [
					role,
					value
				])
			)
		).toMatchSnapshot();
	}
);

test.each(themes)('%s renders partial shared palettes on the instance', async (theme) => {
	const output = await renderTheme(theme, { palette: { primary: '#123456' } });
	expect(output.body).toContain('--color-primary-light: #123456; --color-primary-dark: #123456;');
	expect(output.body).not.toContain('--color-secondary-');
	expect(output.head).not.toContain('#123456');
});

test.each(themes)('%s merges separate partial light/dark palettes independently', async (theme) => {
	const output = await renderTheme(theme, {
		palette: { light: { primary: '#123' }, dark: { secondary: '#4568' } }
	});
	expect(output.body).toContain('--color-primary-light: #123; --color-secondary-dark: #4568;');
	expect(output.body).not.toContain('--color-primary-dark');
	expect(output.body).not.toContain('--color-secondary-light');
});

test.each(themes)(
	'%s renders children and isolates same-theme and cross-theme instances',
	async (theme) => {
		const { createRawSnippet } = await server.ssrLoadModule('svelte');
		const inner = await renderTheme(theme);
		const different = await renderTheme(
			themes.find((name) => name !== theme),
			{
				palette: { primary: '#abcdef' }
			}
		);
		const output = await renderTheme(theme, {
			palette: { primary: '#123456' },
			children: createRawSnippet(() => ({
				render: () => `<section>${inner.body}${different.body}</section>`
			}))
		});
		expect(output.body.match(/--color-primary-light: #123456/g)).toHaveLength(1);
		expect(output.body.match(/--color-primary-light: #abcdef/g)).toHaveLength(1);
		expect(output.body).toContain(inner.body);
		expect(output.body).toContain('<section>');
		// A subsequent render must not inherit a previous request's palette.
		expect((await renderTheme(theme)).body).not.toContain('#123456');
	}
);

test('empty palettes retain defaults, including an empty mode', () => {
	expect(paletteStyle()).toBe('');
	expect(paletteStyle({ light: {}, dark: {} })).toBe('');
	expect(paletteStyle({ light: {}, dark: { error: '#F008' } })).toBe('--color-error-dark: #F008;');
});

test.each(['#123', '#ABCD', '#123456', '#ABCDEF80'])('accepts core hex format %s', (primary) => {
	expect(paletteStyle({ primary })).toContain(`--color-primary-light: ${primary};`);
});

test.each(['red', '#12', '#12345', '#gggggg', '#123; color: red', '</style>'])(
	'rejects invalid colors before serializing CSS: %s',
	(primary) => {
		expect(() => paletteStyle({ primary })).toThrow(
			'Theme palette light.primary must be a hex color.'
		);
		expect(() => paletteStyle({ light: {}, dark: { primary } })).toThrow(
			'Theme palette dark.primary must be a hex color.'
		);
	}
);
