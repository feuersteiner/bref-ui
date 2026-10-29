import { chromium } from 'playwright';
import { createServer } from 'vite';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { encoder, root } from './browser.mjs';

const output = resolve(root, 'public/footage');
await mkdir(output, { recursive: true });
const server = await createServer({
	root: resolve(root, '../docs'),
	logLevel: 'error',
	server: { host: '127.0.0.1', port: 4176, strictPort: true }
});
await server.listen();
let browser;
try {
	browser = await chromium.launch();
	for (const [id, path] of [
		['todo', 'todo'],
		['shop', 'house-shop'],
		['runner', 'runner-ai']
	]) {
		console.log(`Capturing ${id} from the docs application…`);
		const page = await browser.newPage({
			viewport: { width: 1280, height: 720 },
			deviceScaleFactor: 1
		});
		const errors = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.clock.install();
		await page.goto(`http://127.0.0.1:4176/demo/${path}`, { waitUntil: 'networkidle' });
		await page.clock.fastForward(1500);
		await page.evaluate(() => document.fonts.ready);
		await page.evaluate(() =>
			Promise.all(Array.from(document.images).map((image) => image.decode()))
		);
		await page.addStyleTag({
			content: 'body { overflow: hidden; } footer { display: none !important; }'
		});
		const video = encoder(resolve(output, `${id}.mp4`));
		try {
			for (let frame = 0; frame < 120; frame++) {
				if (id === 'todo' && frame === 24)
					await page
						.getByRole('checkbox', { name: /^Complete / })
						.first()
						.click();
				if (id === 'todo' && frame === 65)
					await page.getByRole('button', { name: 'New task', exact: true }).click();
				if (id === 'shop' && frame === 24)
					await page.getByRole('button', { name: 'View Sunday chair', exact: true }).click();
				if (id === 'runner' && frame === 25)
					await page.getByRole('button', { name: 'Retry run', exact: true }).click();
				await page.clock.fastForward(1000 / 30);
				await video.write(await page.screenshot({ type: 'jpeg', quality: 90 }));
			}
			if (errors.length) throw new Error(errors.join('\n'));
			await video.finish();
		} catch (error) {
			video.abort();
			throw error;
		}
		await page.close();
	}
} finally {
	await browser?.close();
	await server.close();
}
