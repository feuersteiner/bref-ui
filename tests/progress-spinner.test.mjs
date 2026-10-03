import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

let vite;
let render;
let Progress;
let Spinner;

before(async () => {
	vite = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
		optimizeDeps: { noDiscovery: true }
	});
	({ render } = await vite.ssrLoadModule('svelte/server'));
	({ default: Progress } = await vite.ssrLoadModule('/src/lib/progress/progress.svelte'));
	({ default: Spinner } = await vite.ssrLoadModule('/src/lib/spinner/spinner.svelte'));
});

after(async () => {
	await vite?.close();
});

test('progress exposes a named native indicator and omits value when indeterminate', () => {
	const html = render(Progress, { props: { label: 'Loading' } }).body;
	assert.match(html, /<progress[^>]*aria-label="Loading"/);
	assert.doesNotMatch(html, /<progress[^>]*\bvalue=/);
});

test('progress clamps finite values and rejects invalid bounds in all modes', () => {
	const html = render(Progress, { props: { label: 'Upload', value: 5, max: 2 } }).body;
	assert.match(html, /<progress[^>]*max="2"[^>]*value="2"/);
	assert.throws(() => render(Progress, { props: { label: 'Bad', max: 0 } }).body, RangeError);
	assert.throws(
		() => render(Progress, { props: { label: 'Bad', max: Infinity } }).body,
		RangeError
	);
	assert.throws(() => render(Progress, { props: { label: 'Bad', value: NaN } }).body, RangeError);
});

test('seekable progress exposes one named range input with native associations', () => {
	const html = render(Progress, {
		props: {
			label: 'Position',
			value: 0.25,
			id: 'position',
			'aria-describedby': 'hint',
			onSeek: () => {}
		}
	}).body;
	assert.match(html, /<progress[^>]*aria-hidden="true"/);
	assert.match(html, /<input[^>]*type="range"[^>]*id="position"[^>]*aria-describedby="hint"/);
	assert.match(html, /<input[^>]*aria-label="Position"/);
	assert.doesNotMatch(html, /<progress[^>]*id="position"/);
});

test('spinner exposes static status text', () => {
	const html = render(Spinner, { props: { label: 'Saving' } }).body;
	assert.match(html, /role="status"/);
	assert.match(html, /Saving/);
});
