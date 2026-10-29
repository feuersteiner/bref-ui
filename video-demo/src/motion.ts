import { clamp, smooth } from './timeline.js';
export type Keyframe = readonly [time: number, x: number, y: number, scale?: number];
export const motion = (time: number, keys: readonly Keyframe[]) => {
	const next = keys.findIndex((key) => key[0] > time);
	const a = keys[next < 0 ? keys.length - 1 : Math.max(next - 1, 0)];
	const b = keys[next < 0 ? keys.length - 1 : next];
	const p = smooth((time - a[0]) / Math.max(b[0] - a[0], 0.001));
	return {
		x: a[1] + (b[1] - a[1]) * p,
		y: a[2] + (b[2] - a[2]) * p,
		scale: (a[3] ?? 1) + ((b[3] ?? 1) - (a[3] ?? 1)) * p
	};
};
export const camera = (time: number, keys: readonly Keyframe[], centerX = 960) => {
	const { x, y, scale } = motion(time, keys);
	return `translate(${clamp(centerX - x * scale, 1920 * (1 - scale), 0)}px, ${clamp(540 - y * scale, 1080 * (1 - scale), 0)}px) scale(${scale})`;
};
export const clickPulse = (time: number, clicks: readonly number[]) => {
	const click = clicks.findLast((value) => value <= time) ?? -100;
	return clamp((time - click) / 0.38);
};
