import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { verifyMotion } from './verify-motion.mjs';
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
	await at('demos', 0.75);
	assert.equal((await app.page.locator('h1').innerText()).trim(), 'New demos');
	await screenshot('new-demos');
	await at('apps', 10.8);
	assert.equal(await app.page.locator('.demo-column').count(), 3);
	assert.equal(await app.page.locator('.demo-column p').count(), 0);
	for (const id of ['todo', 'shop', 'runner']) {
		const column = app.page
			.locator('.demo-column')
			.filter({ has: app.page.locator(`video[src$="${id}.mp4"]`) });
		assert.equal(await column.locator('h2 > [aria-hidden="true"]').count(), 1);
		const video = await column.locator('video').evaluate((v) => ({
			duration: v.duration,
			time: v.currentTime,
			width: v.videoWidth,
			height: v.videoHeight,
			rate: v.playbackRate
		}));
		assert.ok(Math.abs(video.duration - 14) < 0.1 && Math.abs(video.time - 10.8) < 0.1);
		assert.ok(Math.abs(video.rate - 14 / 9) < 0.001);
		assert.equal(video.width, 768);
		assert.equal(video.height, 1152);
		const bounds = await column.locator('.demo-frame').boundingBox();
		assert.ok(bounds.height > 850 && bounds.width > 580 && bounds.y + bounds.height <= 1080);
	}
	await screenshot('apps');
	await at('apps', 2);
	assert.ok(
		(
			await app.page.locator('video').evaluateAll((videos) => videos.map((v) => v.currentTime))
		).every((t) => Math.abs(t - 2) < 0.1)
	);
	await at('install', 2);
	assert.match(await app.page.locator('.commands').innerText(), /npm install bref-ui/);
	await at('compose', 8.1);
	const full = await app.page.locator('.composition-source pre').boundingBox();
	assert.ok(full.y >= 0 && full.y + full.height <= 1080);
	await at('compose', 13.5);
	assert.equal(await app.page.getByLabel('Email', { exact: true }).inputValue(), 'alex@studio.com');
	assert.equal(await app.page.locator('.mini-form input').count(), 4);
	await screenshot('form');
	await app.page.getByLabel('Email', { exact: true }).fill('manual@studio.com');
	await app.page.getByRole('switch').check();
	await app.page.getByRole('button', { name: /Create workspace/ }).click();
	assert.ok(await app.page.getByRole('button', { name: /Workspace created/ }).isVisible());
	for (const [name, time] of [
		['blue', 1.5],
		['green', 5],
		['red', 8],
		['dark', 10]
	]) {
		await at('customize', time);
		assert.equal((await app.page.locator('h1').innerText()).trim(), 'Customize your theme');
		assert.equal(await app.page.locator('.palette-controls button').count(), 4);
		await screenshot(`${name}-crop`, '.signup-card');
	}
	assert.equal(await app.page.locator('.signup-preview').getAttribute('data-theme'), 'dark');
	await screenshot('customize');
	await at('cli', 8);
	assert.match(await app.page.locator('.commands').innerText(), /npx bref-ui add switch/);
	await at('files', 0.8);
	const origin = await app.page.locator('.flying-file').boundingBox();
	await screenshot('files-departure');
	await at('files', 2.4);
	const arrival = await app.page.locator('.flying-file').boundingBox();
	assert.ok(arrival.x - origin.x > 650);
	await at('files', 3.1);
	assert.match(await app.page.locator('.codebase').innerText(), /src\/lib\/ui/);
	assert.match(await app.page.locator('.copied-source').innerText(), /switch.svelte/);
	assert.equal(await app.page.getByRole('img', { name: 'npm', exact: true }).count(), 1);
	await screenshot('files');
	await verifyMotion(app, timeline, at, screenshot);
	await at('vscode', 8);
	assert.equal(
		await app.page.getByRole('tablist', { name: 'Activity' }).getAttribute('aria-orientation'),
		'vertical'
	);
	assert.match(
		await app.page.getByRole('group', { name: 'Workspace files', exact: true }).innerText(),
		/switch.svelte/
	);
	assert.ok(
		parseFloat(
			await app.page.locator('.ade-source pre').evaluate((e) => getComputedStyle(e).fontSize)
		) <= 20
	);
	await screenshot('ade-working');
	await at('vscode', 16);
	assert.ok(await app.page.getByRole('button', { name: 'Changes applied' }).isVisible());
	await screenshot('ade');
	await at('glassy', 17);
	assert.equal(await app.page.getByRole('switch').isChecked(), true);
	assert.ok(await app.page.getByRole('button', { name: 'You’re in' }).isVisible());
	assert.equal(
		await app.page.locator('.calendar-days button.selected').getAttribute('aria-label'),
		'October 24'
	);
	await screenshot('glassy');
	await at('theme-install', 6.5);
	for (const theme of ['new-paris', 'vscode', 'glassy'])
		assert.match(
			await app.page.locator('.commands').innerText(),
			new RegExp(`bref-ui-themes/${theme}`)
		);
	await screenshot('theme-imports');
	await at('end', 1);
	assert.equal(await app.page.locator('.closing-actions a').count(), 4);
	for (const time of [3.8, 6.8]) {
		await at('end', time);
		assert.ok(await app.page.locator('.logo').isVisible());
	}
	await screenshot('end');
	assert.deepEqual(app.errors, []);
	await app.page.goto('http://127.0.0.1:4177/?t=1');
	await app.page.getByRole('button', { name: 'Pause showcase' }).click();
	await app.page.getByRole('button', { name: /Find your theme/ }).click();
	assert.match(await app.page.locator('.theme-label').innerText(), /#1 New Paris/);
	await app.page.setViewportSize({ width: 390, height: 844 });
	assert.ok(await app.page.getByRole('button', { name: 'Play showcase' }).isVisible());
	assert.equal(
		await app.page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
		false
	);
	console.log(
		`Verified 60-second film, portrait recordings, copy animation, stable Paris layout, ADE, Glassy, outro and mobile player. Screenshots: ${output}`
	);
} finally {
	await app.close();
}
