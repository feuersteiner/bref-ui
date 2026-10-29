import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { root, seek, studio } from './browser.mjs';

const output = resolve(root, 'output/review');
await mkdir(output, { recursive: true });
const app = await studio(1920, 4177);
try {
	const examples = [
		['intro', 7, 'Human first.'],
		['todo', 12, 'Todo'],
		['shop', 16, 'House Shop'],
		['runner', 20, 'RunnerAI'],
		['install', 28, 'npm install bref-ui'],
		['compose', 41, 'Stay in'],
		['customize', 48, '#bd586d'],
		['light', 52, 'LIGHT'],
		['dark', 55, 'DARK'],
		['cli', 67, 'npx bref-ui add button'],
		['files', 76, '#bref/*'],
		['own-compose', 88, "'#bref'"],
		['paris', 101, 'Quietly'],
		['vscode', 113, 'Deployed successfully'],
		['glassy', 125, 'Somewhere softer'],
		['end', 135, 'Build cool']
	];
	for (const [name, time, text] of examples) {
		await seek(app.page, time);
		assert.ok(
			(await app.page.locator('.film').innerText()).includes(text),
			`Missing ${text} at ${time}s`
		);
		await app.page.locator('.film').screenshot({ path: resolve(output, `${name}.png`) });
		const clipped = await app.page.locator('.scene').evaluate((scene) => {
			const bounds = scene.getBoundingClientRect();
			return Array.from(scene.querySelectorAll('h1,h2,h3,pre')).some((element) => {
				const box = element.getBoundingClientRect();
				return box.width > 0 && (box.right > bounds.right + 24 || box.bottom > bounds.bottom + 30);
			});
		});
		assert.equal(clipped, false, `Content extends outside the scene: ${name}`);
	}
	await seek(app.page, 41);
	await app.page.getByRole('button', { name: 'Count me in' }).click();
	assert.ok(await app.page.getByRole('button', { name: "You're in!" }).isVisible());
	const checkbox = app.page.getByRole('switch');
	await checkbox.uncheck();
	assert.equal(await checkbox.isChecked(), false);
	await app.page.goto('http://127.0.0.1:4177/?t=7');
	await app.page.getByRole('button', { name: 'Pause showcase' }).click();
	await app.page.getByRole('button', { name: '04 Find your theme' }).click();
	assert.ok((await app.page.locator('.film').innerText()).includes('Start with a theme.'));
	await app.page.getByRole('slider', { name: 'Seek video' }).fill('135');
	assert.ok((await app.page.locator('.film').innerText()).includes('Build cool'));
	await app.page.setViewportSize({ width: 390, height: 844 });
	assert.ok(await app.page.getByRole('button', { name: 'Play showcase' }).isVisible());
	assert.equal(
		await app.page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
		false
	);
	assert.deepEqual(app.errors, []);
	console.log(
		`Verified ${examples.length} storyboard states, live controls, chapter seeking and mobile layout. Review frames: ${output}`
	);
} finally {
	await app.close();
}
