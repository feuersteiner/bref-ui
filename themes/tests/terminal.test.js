import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

let server;
let render;

before(async () => {
	server = await createServer({
		configFile: false,
		plugins: [svelte({ configFile: false })],
		ssr: { noExternal: ['bref-ui', 'bref-ui-themes'] },
		server: { middlewareMode: true },
		appType: 'custom'
	});
	({ render } = await server.ssrLoadModule('svelte/server'));
});

after(async () => await server?.close());

for (const theme of ['new-paris', 'glassy', 'crystal-code', 'vscode'])
	test(`${theme} exports Terminal with the core text and native attribute contract`, async () => {
		const { Terminal } = await server.ssrLoadModule(`/src/lib/${theme}/index.ts`);
		const { body } = render(Terminal, {
			props: {
				lines: ['first', '', '<b>literal</b>'],
				windowTitle: 'A custom title',
				id: `${theme}-output`,
				'aria-label': 'Build output',
				class: 'consumer-class',
				style: 'border-radius: 2rem; max-height: 9rem'
			}
		});
		for (const text of [
			'first\n\n&lt;b>literal&lt;/b>',
			'A custom title',
			'aria-label="Build output"',
			`id="${theme}-output"`,
			'consumer-class',
			'tabindex="0"'
		])
			assert(body.includes(text));
		assert.match(body, /style="[^"]*border-radius: 2rem; max-height: 9rem\s*"/);
		assert(!body.includes('<b>'));
	});
