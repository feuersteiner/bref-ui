import { afterAll, beforeAll, expect, test } from 'vitest';
import { createServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

let server;
let Terminal;
let render;

beforeAll(async () => {
	server = await createServer({
		configFile: false,
		plugins: [svelte({ configFile: false })],
		server: { middlewareMode: true },
		appType: 'custom'
	});
	Terminal = (await server.ssrLoadModule('/src/lib/terminal/terminal.svelte')).default;
	({ render } = await server.ssrLoadModule('svelte/server'));
});

afterAll(async () => await server?.close());

test('renders ordered, escaped plain text with whitespace and blank lines intact', () => {
	const lines = ['$ echo hello', '', '  indented\tvalue', '<script>alert(1)</script>', '& done'];
	const { body } = render(Terminal, { props: { lines } });
	expect(body).toContain(
		'$ echo hello\n\n  indented\tvalue\n&lt;script>alert(1)&lt;/script>\n&amp; done'
	);
	expect(body).not.toContain('<script>');
	expect(lines).toHaveLength(5);
});

test('empty output is a named, focusable viewport with decorative chrome, not controls', () => {
	const { body } = render(Terminal, { props: { lines: [] } });
	expect(body).toContain('role="region"');
	expect(body).toContain('aria-label="Terminal"');
	expect(body).toContain('tabindex="0"');
	expect(body).toContain('aria-hidden="true"');
	expect(body).not.toMatch(/<header|<button|<input|aria-live|role="log"/);
});

test('forwards native attributes and permits accessible naming and focus overrides', () => {
	const { body } = render(Terminal, {
		props: {
			lines: ['done'],
			windowTitle: 'bref — build',
			id: 'build-output',
			class: 'custom',
			style: 'max-height: 10rem',
			title: 'Native tooltip',
			dir: 'rtl',
			tabindex: -1,
			'aria-label': 'Build output'
		}
	});
	expect(body).toContain('bref — build');
	for (const attribute of [
		'id="build-output"',
		'custom',
		'max-height: 10rem',
		'title="Native tooltip"',
		'dir="rtl"',
		'tabindex="-1"',
		'aria-label="Build output"'
	])
		expect(body).toContain(attribute);
	expect(body).not.toContain('aria-label="bref — build"');
});

test('a blank visible title retains the default accessible name', () => {
	const { body } = render(Terminal, { props: { lines: [], windowTitle: '' } });
	expect(body).toContain('aria-label="Terminal"');
});
