import assert from 'node:assert/strict';
import { seek } from './browser.mjs';

export const verifyMotion = async (app, timeline, at, screenshot) => {
	const screenAt = async (id, seconds) =>
		seek(app.page, timeline.scenes.find((s) => s.id === id).start + seconds);
	const opacity = async (selector) =>
		app.page
			.locator(selector)
			.evaluateAll((es) => es.map((e) => Number(getComputedStyle(e).opacity)));
	for (const [seconds, expected] of [
		[0.2, [true, false, false]],
		[0.4, [true, true, false]],
		[0.6, [true, true, true]]
	]) {
		await screenAt('apps', seconds);
		const columns = await opacity('.demo-column');
		assert.deepEqual(
			columns.map((p) => p > 0),
			expected
		);
		await screenshot(`columns-${seconds}`);
	}
	await screenAt('import-title', 0.25);
	const center = await app.page.locator('.chapter-context').boundingBox();
	assert.ok(center.y > 350);
	await screenAt('import-title', 1.22);
	const dock = await app.page.locator('.chapter-context').boundingBox();
	assert.ok(dock.x >= 50 && dock.x < 56 && dock.y < 40);
	await screenshot('import-docked');
	await at('compose', 13.5);
	assert.deepEqual(await app.page.locator('.chapter-context').boundingBox(), dock);
	await at('customize', 5);
	assert.ok((await app.page.locator('.chapter-context').boundingBox()).x < 56);
	assert.ok(
		Number.parseFloat(
			await app.page
				.locator('.composition-source pre')
				.evaluate((e) => getComputedStyle(e).fontSize)
		) >= 34
	);
	await screenshot('customize-context');
	await at('paris', 7.8);
	const nav = await app.page.locator('.paris-nav').boundingBox();
	const campaign = await app.page.locator('.paris-campaign').boundingBox();
	assert.ok(await app.page.getByRole('button', { name: 'Signed in', exact: true }).isVisible());
	assert.equal(
		await app.page.getByLabel('Email address', { exact: true }).inputValue(),
		'alex@atelier.fr'
	);
	assert.deepEqual(await opacity('.paris-login,.paris-shop'), [1, 0]);
	await screenshot('paris-login');
	await at('paris', 10);
	const overlap = await opacity('.paris-login,.paris-shop');
	assert.ok(overlap.every((p) => p > 0 && p < 1));
	await screenshot('paris-transition');
	await at('paris', 20);
	assert.deepEqual(await opacity('.paris-login,.paris-shop'), [0, 1]);
	assert.deepEqual(await app.page.locator('.paris-nav').boundingBox(), nav);
	assert.deepEqual(await app.page.locator('.paris-campaign').boundingBox(), campaign);
	assert.equal(await app.page.locator('.fashion-grid img').count(), 3);
	assert.ok(await app.page.getByRole('button', { name: 'Added to bag' }).isVisible());
	await screenshot('paris-products');
	await at('vscode', 8);
	const tabs = await app.page
		.locator('.activity-bar [role=tab]')
		.evaluateAll((es) => es.map((e) => e.getBoundingClientRect().height));
	assert.ok(tabs.every((height) => height >= 60));
	for (const id of ['paris', 'vscode', 'glassy']) {
		await screenAt(id, 0);
		assert.equal(
			await app.page
				.locator('.page-wipe')
				.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41),
			0
		);
		await screenAt(id, 0.11);
		const wipe = await app.page
			.locator('.page-wipe')
			.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
		assert.ok(wipe > 0 && wipe < 1920);
		await screenshot(`swipe-${id}`);
		await screenAt(id, 0.3);
		assert.ok((await app.page.locator('.page-wipe').boundingBox()).x <= -1920);
	}
	await at('end', 1.3);
	assert.equal(await app.page.locator('.closing-actions .kinetic').count(), 4);
	await screenshot('cta');
	await at('end', 6.8);
	assert.equal(
		await app.page.locator('.film').evaluate((e) => getComputedStyle(e).backgroundColor),
		'rgb(241, 238, 231)'
	);
	await screenshot('light-logo');
};
