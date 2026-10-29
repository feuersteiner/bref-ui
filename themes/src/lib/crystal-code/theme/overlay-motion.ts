import { cubicOut } from 'svelte/easing';
import { prefersReducedMotion } from 'svelte/motion';
import { fly, type FlyParams, type TransitionConfig } from 'svelte/transition';

/** Inherited theme recipes retain the shared controls' default timing. */
export const overlayMotion = (
	node: Element,
	duration: number,
	lift: number,
	surface = false
): TransitionConfig => {
	const style = getComputedStyle(node);
	const read = (name: string, fallback: number) => {
		const value = parseFloat(style.getPropertyValue(name));
		return Number.isFinite(value) ? value : fallback;
	};
	const y = prefersReducedMotion.current ? 0 : read('--bref-overlay-lift', lift);
	const scale = prefersReducedMotion.current ? 1 : read('--bref-overlay-scale', 1);
	return {
		duration: prefersReducedMotion.current ? 0 : read('--bref-overlay-duration', duration),
		easing: cubicOut,
		css: (t, u) =>
			surface
				? `--surface-motion-opacity: ${t}; --surface-motion-offset: ${u * y}px; --surface-motion-scale: ${scale + (1 - scale) * t}`
				: `opacity: ${t}; transform: translateY(${u * y}px) scale(${scale + (1 - scale) * t})`
	};
};

/** Theme-specific appearance timing; leave other themes' recipes intact. */
export const appearanceMotion = (node: Element, defaults: FlyParams = {}): TransitionConfig => {
	const style = getComputedStyle(node);
	const duration = parseFloat(style.getPropertyValue('--bref-appearance-duration'));
	const lift = parseFloat(style.getPropertyValue('--bref-appearance-lift'));
	return fly(node, {
		...defaults,
		...(Number.isFinite(duration) ? { duration } : {}),
		...(Number.isFinite(lift) ? { y: lift, easing: cubicOut } : {}),
		...(prefersReducedMotion.current ? { duration: 0, y: 0 } : {})
	});
};
