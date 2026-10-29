import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { root, seek, studio } from './browser.mjs';
const output = resolve(root, 'output/review');
await mkdir(output, { recursive: true });
const app = await studio(1920, 4177);
try {
	const timeline = await app.page.evaluate(async () => {
		const { scenes, starts, duration } = await import('/src/timeline.ts');
		return { duration, scenes: scenes.map((s, i) => ({ ...s, start: starts[i] })) };
	});
	assert.equal(timeline.duration, 60);
	const at = async (id, time) => {
		const scene = timeline.scenes.find((s) => s.id === id);
		await seek(app.page, scene.start + (time * scene.duration) / scene.sourceDuration);
	};
	const screenshot = async (name, selector = '.film') =>
		app.page.locator(selector).screenshot({ path: resolve(output, `${name}.png`) });
	await at('apps', 10.8);
	assert.equal(await app.page.locator('.demo-column').count(), 3);
	for (const id of ['todo', 'shop', 'runner']) {
		const column = app.page
			.locator('.demo-column')
			.filter({ has: app.page.locator(`video[src$="${id}.mp4"]`) });
		assert.equal(
			await column.locator('h2').innerText(),
			id === 'todo' ? 'Todo app.' : id === 'shop' ? 'Ecommerce shop.' : 'SaaS AI app.'
		);
		const video = await column.locator('video').evaluate((v) => ({
			duration: v.duration,
			time: v.currentTime,
			width: v.videoWidth,
			height: v.videoHeight,
			rate: v.playbackRate
		}));
		assert.ok(Math.abs(video.duration - 14) < 0.1);
		assert.ok(Math.abs(video.time - 10.8) < 0.1);
		assert.ok(Math.abs(video.rate - 14 / 9) < 0.001);
		assert.equal(video.width, 1920);
		assert.equal(video.height, 1080);
		const bounds = await column.boundingBox();
		assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 1920);
	}
	await screenshot('apps');
	await at('apps', 2);
	assert.ok(
		(
			await app.page.locator('video').evaluateAll((videos) => videos.map((v) => v.currentTime))
		).every((t) => Math.abs(t - 2) < 0.1)
	);
	await at('apps', 13.8);
	assert.ok(
		(
			await app.page.locator('video').evaluateAll((videos) => videos.map((v) => v.currentTime))
		).every((t) => Math.abs(t - 13.8) < 0.1)
	);
	await at('install', 2);
	assert.match(await app.page.locator('.commands').innerText(), /npm install bref-ui/);
	await at('compose', 8.1);
	const full = await app.page.locator('.composition-source pre').boundingBox();
	assert.ok(full.y >= 0 && full.y + full.height <= 1080, 'Raw source fits the film.');
	await at('compose', 13.5);
	assert.equal(await app.page.getByLabel('Email', { exact: true }).inputValue(), 'alex@studio.com');
	assert.equal(await app.page.locator('.mini-form input').count(), 4);
	assert.equal((await app.page.locator('.mini-form [aria-hidden="true"]').count()) > 0, true);
	await screenshot('form');
	await screenshot('form-crop', '.signup-card');
	const base = await app.page
		.locator('.signup-preview')
		.evaluate((e) => getComputedStyle(e).backgroundColor);
	assert.equal(base, 'rgb(241, 238, 231)');
	const filmColor = await app.page
		.locator('.film')
		.evaluate((e) => getComputedStyle(e).backgroundColor);
	await at('customize', 5);
	assert.equal(await app.page.locator('.palette-controls button').count(), 4);
	const controls = await app.page
		.locator('.palette-controls button')
		.evaluateAll((elements) => elements.map((e) => e.getBoundingClientRect().y));
	assert.ok(controls.every((y) => y === controls[0]));
	assert.notEqual(
		await app.page.locator('.signup-preview').evaluate((e) => getComputedStyle(e).backgroundColor),
		base
	);
	await screenshot('green-crop', '.signup-card');
	await app.page.getByRole('button', { name: 'Red', exact: true }).click();
	await screenshot('palette');
	await screenshot('red-crop', '.signup-card');
	await at('customize', 10);
	assert.equal(await app.page.locator('.signup-preview').getAttribute('data-theme'), 'dark');
	assert.equal(
		await app.page.locator('.film').evaluate((e) => getComputedStyle(e).backgroundColor),
		filmColor
	);
	await screenshot('dark');
	await screenshot('dark-crop', '.signup-card');
	await app.page.getByRole('button', { name: 'Toggle dark mode' }).click();
	assert.equal(await app.page.locator('.signup-preview').getAttribute('data-theme'), 'light');
	await at('own-compose', 13.5);
	assert.match(await app.page.locator('.code-source').innerText(), /from '#bref'/);
	assert.equal(await app.page.getByLabel('Email', { exact: true }).inputValue(), 'alex@studio.com');
	await app.page.getByLabel('Email', { exact: true }).fill('manual@studio.com');
	await app.page.getByRole('switch').check();
	assert.equal(await app.page.getByRole('switch').isChecked(), true);
	await app.page.getByRole('button', { name: /Create workspace/ }).click();
	assert.ok(await app.page.getByRole('button', { name: /Workspace created/ }).isVisible());
	await at('files', 6);
	assert.match(await app.page.locator('.source-tree').innerText(), /text-input.svelte/);
	assert.equal((await app.page.locator('.file-icon').count()) > 10, true);
	await screenshot('files');
	await at('paris', 1);
	await screenshot('paris-hero');
	await at('paris', 20);
	await screenshot('paris-form');
	await screenshot('paris-crop', '.paris-build .mini-form');
	assert.equal(await app.page.getByLabel('Email', { exact: true }).inputValue(), 'alex@studio.com');
	assert.ok(await app.page.getByRole('button', { name: /WORKSPACE CREATED/i }).isVisible());
	await at('vscode', 15);
	assert.ok(await app.page.getByRole('button', { name: 'Preview', exact: true }).isVisible());
	await screenshot('vscode-select');
	await screenshot('vscode-crop', '.workbench-settings');
	await at('vscode', 19.5);
	assert.ok(await app.page.getByRole('button', { name: 'Deployed', exact: true }).isVisible());
	await screenshot('vscode');
	await at('glassy', 18);
	assert.equal(await app.page.getByRole('switch').isChecked(), true);
	await screenshot('glassy');
	await screenshot('glassy-crop', '.glass-widgets');
	await at('theme-install', 6.5);
	for (const theme of ['new-paris', 'vscode', 'glassy'])
		assert.match(
			await app.page.locator('.commands').innerText(),
			new RegExp(`bref-ui-themes/${theme}`)
		);
	await screenshot('theme-imports');
	await at('end', 6.5);
	assert.equal(await app.page.locator('.kinetic').getAttribute('aria-label'), 'Build cool shit ;)');
	await screenshot('end');
	assert.equal(await app.page.locator('.film > header,.film > footer,.editor-chrome').count(), 0);
	await app.page.goto('http://127.0.0.1:4177/?t=1');
	await app.page.getByRole('button', { name: 'Pause showcase' }).click();
	await app.page.getByRole('button', { name: /Find your theme/ }).click();
	assert.match(await app.page.locator('.kinetic').getAttribute('aria-label'), /Lazy/);
	await app.page.setViewportSize({ width: 390, height: 844 });
	assert.ok(await app.page.getByRole('button', { name: 'Play showcase' }).isVisible());
	assert.equal(
		await app.page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
		false
	);
	assert.deepEqual(app.errors, []);
	console.log(
		`Verified 60-second storyboard, three simultaneous 1080p app recordings, mini form interactions, isolated palettes, dark mode, theme interactions, seeking and mobile player. Screenshots: ${output}`
	);
} finally {
	await app.close();
}
