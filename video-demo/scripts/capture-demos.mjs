import { chromium } from 'playwright';
import { format } from 'prettier';
import { createServer } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { encoder, root } from './browser.mjs';
import { center, move } from './capture-cursor.mjs';

const output = resolve(root, 'public/footage');
await mkdir(output, { recursive: true });
const server = await createServer({
	root: resolve(root, '../docs'),
	logLevel: 'error',
	server: { host: '127.0.0.1', port: 4176, strictPort: true }
});
await server.listen();
let browser;
const shots = JSON.parse(await readFile(resolve(output, 'shots.json'), 'utf8').catch(() => '{}'));
const requested = process.argv.slice(2);
try {
	browser = await chromium.launch();
	for (const [id, path] of [
		['todo', 'todo'],
		['shop', 'house-shop'],
		['runner', 'runner-ai']
	]) {
		if (requested.length && !requested.includes(id)) continue;
		console.log(`Capturing ${id}: 14 seconds, slow scroll, two deliberate interactions.`);
		const page = await browser.newPage({
			viewport: { width: 768, height: 1152 },
			deviceScaleFactor: 1
		});
		const errors = [];
		page.on('pageerror', (e) => errors.push(e.message));
		await page.clock.install();
		await page.goto(`http://127.0.0.1:4176/demo/${path}`, { waitUntil: 'networkidle' });
		await page.clock.runFor(id === 'runner' ? 24000 : 1500);
		await page.evaluate(() => document.fonts.ready);
		await page.evaluate(() =>
			Promise.all(Array.from(document.images).map((image) => image.decode()))
		);
		await page.addStyleTag({
			content: `html{scroll-behavior:auto!important;zoom:1.05}body{overflow-x:hidden}footer{display:none!important}`
		});
		const first =
			id === 'todo'
				? page.getByRole('checkbox', { name: /^Complete / }).first()
				: id === 'shop'
					? page.getByRole('button', { name: 'View Sunday chair', exact: true })
					: page.getByRole('button', { name: 'Retry run', exact: true });
		const scrollTo = await page.evaluate(() =>
			Math.max(0, document.documentElement.scrollHeight - innerHeight)
		);
		const firstBox = await first.boundingBox();
		const target =
			id === 'shop' ? Math.min(scrollTo, Math.max(0, firstBox.y - 400)) : Math.min(scrollTo, 300);
		let firstPoint = [690, 1020],
			secondPoint = firstPoint,
			second;
		const video = encoder(resolve(output, `${id}.mp4`));
		try {
			for (let frame = 0; frame < 420; frame++) {
				if (frame <= 145) {
					const p = Math.min(1, Math.max(0, (frame - 24) / 120));
					const eased = p * p * p * (p * (p * 6 - 15) + 10);
					await page.evaluate(
						(y) => window.scrollTo(0, y),
						target *
							(id === 'runner'
								? (p < 0.5 ? 2 * p : 2 * (1 - p)) ** 2 * (3 - 2 * (p < 0.5 ? 2 * p : 2 * (1 - p)))
								: eased)
					);
				}
				if (frame === 145) {
					await first.scrollIntoViewIfNeeded();
					firstPoint = await center(first);
				}
				if (frame === 195) await first.click();
				if (frame === 235) {
					second =
						id === 'todo'
							? page.getByRole('button', { name: 'New task', exact: true })
							: id === 'shop'
								? page
										.getByRole('dialog')
										.getByRole('button', { name: 'Add Sunday chair, Ivory to cart', exact: true })
								: page.getByRole('button', { name: /^Inspect Value proposition,/ });
					await second.scrollIntoViewIfNeeded();
					secondPoint = await center(second);
				}
				if (frame === 294) await second.click();
				const point =
					frame < 150
						? [690, 1020]
						: frame < 195
							? move([690, 1020], firstPoint, (frame - 150) / 45)
							: frame < 249
								? firstPoint
								: frame < 294
									? move(firstPoint, secondPoint, (frame - 249) / 45)
									: secondPoint;
				await page.mouse.move(point[0], point[1]);
				await page.clock.runFor(1000 / 30);
				await video.write(await page.screenshot({ type: 'jpeg', quality: 94 }));
			}
			if (errors.length) throw new Error(errors.join('\n'));
			await video.finish();
		} catch (error) {
			video.abort();
			throw error;
		}
		shots[id] = { first: firstPoint, second: secondPoint };
		console.log(id, shots[id]);
		await page.close();
	}
	await writeFile(
		resolve(output, 'shots.json'),
		await format(JSON.stringify(shots), { parser: 'json', useTabs: true, printWidth: 100 })
	);
} finally {
	await browser?.close();
	await server.close();
}
