import type { HTMLAttributes } from 'svelte/elements';
import type { Color, Size } from '../types.js';

export type SpinnerProps = Omit<HTMLAttributes<HTMLSpanElement>, 'color' | 'size'> & {
	label: string;
	size?: Size;
	color?: Color;
	ref?: HTMLSpanElement | null;
};
