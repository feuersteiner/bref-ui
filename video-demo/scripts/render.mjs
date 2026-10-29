import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { encoder, root, seek, studio } from './browser.mjs';

const { values } = parseArgs({
	options: {
		output: { type: 'string', default: 'output/bref-ui-demo.mp4' },
		width: { type: 'string', default: '1920' },
		fps: { type: 'string', default: '30' },
		from: { type: 'string', default: '0' },
		to: { type: 'string' },
		port: { type: 'string', default: '4175' }
	}
});
const width = Number(values.width);
const fps = Number(values.fps);
const from = Number(values.from);
if (
	!Number.isInteger(width) ||
	width < 640 ||
	width % 32 ||
	!Number.isInteger(fps) ||
	fps < 1 ||
	fps > 60 ||
	!Number.isFinite(from) ||
	from < 0
)
	throw new Error('Use width ≥ 640 divisible by 32, fps 1–60, and a non-negative start time.');
const output = resolve(root, values.output);
await mkdir(dirname(output), { recursive: true });
const app = await studio(width, Number(values.port));
let video;
try {
	const duration = await app.page.evaluate(() => window.__brefVideo.duration);
	const to = Number(values.to ?? duration);
	if (!Number.isFinite(to) || to <= from || to > duration)
		throw new Error(`End time must be > start and ≤ ${duration}.`);
	const frames = Math.round((to - from) * fps);
	video = encoder(output, fps);
	console.log(`Rendering ${frames} frames · ${width}×${(width * 9) / 16} · ${fps} fps`);
	for (let frame = 0; frame < frames; frame++) {
		await seek(app.page, from + frame / fps);
		if (app.errors.length) throw new Error(app.errors.join('\n'));
		await video.write(
			await app.page.screenshot({ type: 'jpeg', quality: 94, animations: 'disabled' })
		);
		if (frame % (fps * 5) === 0)
			console.log(`${Math.round((frame / frames) * 100)}% · ${(from + frame / fps).toFixed(1)}s`);
	}
	await video.finish();
	console.log(`Saved ${output}`);
} catch (error) {
	video?.abort();
	throw error;
} finally {
	await app.close();
}
