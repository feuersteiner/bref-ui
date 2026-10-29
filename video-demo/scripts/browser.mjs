import { chromium } from 'playwright';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const studio = async (width = 1920, port = 4175) => {
	const server = await createServer({
		root,
		logLevel: 'error',
		server: { host: '127.0.0.1', port, strictPort: true }
	});
	await server.listen();
	let browser;
	try {
		browser = await chromium.launch();
		const page = await browser.newPage({
			viewport: { width, height: (width * 9) / 16 },
			deviceScaleFactor: 1
		});
		const errors = [];
		page.on('pageerror', (error) => errors.push(error.message));
		page.on('response', (response) => {
			if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
		});
		await page.goto(`http://127.0.0.1:${port}/?render`, { waitUntil: 'networkidle' });
		await page.waitForFunction(() => window.__brefVideo);
		return {
			page,
			errors,
			close: async () => {
				await browser.close();
				await server.close();
			}
		};
	} catch (error) {
		await browser?.close();
		await server.close();
		throw error;
	}
};

export const seek = async (page, time) => {
	const previous = await page.locator('.film').getAttribute('aria-label');
	await page.evaluate((value) => window.__brefVideo.seek(value), time);
	await page.evaluate(() =>
		Promise.all(Array.from(document.images).map((image) => image.decode()))
	);
	const frames = previous === (await page.locator('.film').getAttribute('aria-label')) ? 2 : 7;
	// A newly mounted theme needs its fonts and composited layers painted before capture.
	await page.evaluate(
		(count) =>
			new Promise((resolve) => {
				const paint = () => {
					if (--count <= 0) resolve();
					else requestAnimationFrame(paint);
				};
				requestAnimationFrame(paint);
			}),
		frames
	);
};

export const encoder = (output, fps = 30) => {
	const process = spawn(
		'ffmpeg',
		[
			'-hide_banner',
			'-loglevel',
			'error',
			'-y',
			'-f',
			'image2pipe',
			'-vcodec',
			'mjpeg',
			'-framerate',
			String(fps),
			'-i',
			'pipe:0',
			'-an',
			'-c:v',
			'libx264',
			'-preset',
			'medium',
			'-crf',
			'20',
			'-pix_fmt',
			'yuv420p',
			'-movflags',
			'+faststart',
			output
		],
		{ stdio: ['pipe', 'ignore', 'pipe'] }
	);
	let errors = '';
	process.stderr.on('data', (data) => {
		errors += data;
	});
	process.stdin.on('error', () => {});
	const finished = new Promise((resolve, reject) => {
		process.once('error', reject);
		process.once('close', (code) =>
			code === 0 ? resolve() : reject(new Error(errors || `FFmpeg exited ${code}`))
		);
	});
	// Attach a handler immediately so early encoder failures do not become unhandled rejections.
	finished.catch(() => {});
	return {
		write: async (buffer) => {
			if (process.exitCode !== null || process.stdin.destroyed) {
				await finished;
				return;
			}
			if (!process.stdin.write(buffer)) await once(process.stdin, 'drain');
		},
		finish: async () => {
			process.stdin.end();
			await finished;
		},
		abort: () => process.kill('SIGTERM')
	};
};
