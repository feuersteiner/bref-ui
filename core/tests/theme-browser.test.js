import { afterAll, beforeAll, expect, test } from 'vitest';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

const defaults = {
	'crystal-code': ['rgb(78, 89, 105)', 'rgb(138, 167, 248)'],
	glassy: ['rgb(0, 104, 217)', 'rgb(0, 104, 217)'],
	'new-paris': ['rgb(23, 23, 21)', 'rgb(23, 23, 21)'],
	vscode: ['rgb(55, 148, 255)', 'rgb(55, 148, 255)']
};
let server;
let browser;

beforeAll(async () => {
	server = await createServer({
		root: resolve(import.meta.dirname, '..'),
		configFile: false,
		plugins: [svelte({ configFile: false })],
		server: { host: '127.0.0.1', port: 0, watch: null },
		resolve: { alias: { 'bref-ui-themes': resolve(import.meta.dirname, '../../themes/src/lib') } },
		appType: 'custom'
	});
	server.middlewares.use('/fixture', (_request, response) => {
		response.setHeader('Content-Type', 'text/html');
		response.end(`<!doctype html><html><head></head><body>
<script type="module">import * as fixture from '/tests/theme-fixture.js'; window.fixture = fixture;</script>
</body></html>`);
	});
	await server.listen();
	browser = await chromium.launch();
});
afterAll(async () => {
	await browser?.close();
	await server?.close();
});

const pageFor = async (colorScheme = 'light') => {
	const page = await browser.newPage({ colorScheme });
	await page.goto(`${server.resolvedUrls.local[0]}fixture`);
	await page.waitForFunction(() => window.fixture, null, { timeout: 5000 });
	return page;
};

const add = (page, name, palette) =>
	page.evaluate(([name, palette]) => window.fixture.add(name, palette), [name, palette]);
const colors = (page, id) => page.evaluate((id) => window.fixture.colors(id), id);
const mode = (page, value) =>
	page.evaluate((value) => {
		let meta = document.querySelector('meta[name="color-scheme"]');
		if (!meta) {
			meta = document.createElement('meta');
			meta.name = 'color-scheme';
			document.head.append(meta);
		}
		meta.content = value;
	}, value);

test.each(Object.keys(defaults))(
	'%s preserves defaults and applies palettes in light/dark/system modes',
	async (name) => {
		const page = await pageFor();
		try {
			const original = await add(page, name);
			const shared = await add(page, name, { primary: '#123456' });
			const split = await add(page, name, {
				light: { primary: '#112233' },
				dark: { secondary: '#445566' }
			});
			expect((await colors(page, original)).primary).toBe(
				defaults[name][name === 'vscode' ? 1 : 0]
			);
			await page.emulateMedia({ colorScheme: 'dark' });
			expect((await colors(page, original)).primary).toBe(
				defaults[name][name === 'crystal-code' || name === 'vscode' ? 1 : 0]
			);
			for (const selection of ['light', 'dark', 'light dark']) {
				await mode(page, selection);
				const dark = selection !== 'light';
				const baseline = await colors(page, original);
				expect(baseline.primary).toBe(defaults[name][Number(dark)]);
				expect(await colors(page, shared)).toEqual({ ...baseline, primary: 'rgb(18, 52, 86)' });
				expect(await colors(page, split)).toEqual({
					...baseline,
					...(dark ? { secondary: 'rgb(68, 85, 102)' } : { primary: 'rgb(17, 34, 51)' })
				});
			}
			await page.evaluate((id) => window.fixture.update(id, { primary: '#abcdef' }), shared);
			expect((await colors(page, shared)).primary).toBe('rgb(171, 205, 239)');
			await page.evaluate((id) => window.fixture.update(id, {}), shared);
			expect(await colors(page, shared)).toEqual(await colors(page, original));
		} finally {
			await page.close();
		}
	}
);

test.each(Object.keys(defaults))(
	'%s isolates nested and sibling themes with nearest local mode',
	async (name) => {
		const page = await pageFor('dark');
		try {
			await mode(page, 'dark');
			const outer = await add(page, name, { primary: '#123456' });
			const sibling = await add(page, name);
			const [inner, other] = await page.evaluate(
				([name, id]) => {
					const scope = document.createElement('section');
					scope.dataset.theme = 'light';
					document.querySelector(`[data-test-id="${id}"]`).append(scope);
					return [
						window.fixture.add(name, undefined, scope),
						window.fixture.add(
							name === 'glassy' ? 'new-paris' : 'glassy',
							{ primary: '#fedcba' },
							scope
						)
					];
				},
				[name, outer]
			);
			expect((await colors(page, outer)).primary).toBe('rgb(18, 52, 86)');
			expect((await colors(page, sibling)).primary).toBe(defaults[name][1]);
			expect((await colors(page, inner)).primary).toBe(defaults[name][0]);
			expect((await colors(page, other)).primary).toBe('rgb(254, 220, 186)');
			await page.evaluate((id) => {
				document.querySelector(`[data-test-id="${id}"]`).parentElement.dataset.theme = 'auto';
			}, inner);
			expect((await colors(page, inner)).primary).toBe(defaults[name][1]);
			expect(
				await page.evaluate(() =>
					getComputedStyle(document.documentElement).getPropertyValue('--color-primary-light')
				)
			).not.toBe('#123456');
		} finally {
			await page.close();
		}
	}
);
