import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Color, Size, Variant } from '../types.js';

export type PillProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'color'> & {
	children?: Snippet;
	color?: Exclude<Color, 'background'>;
	size?: Size;
	variant?: Variant;
	ref?: HTMLSpanElement | undefined;
};
