import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { BaseSize, Color, Dimension, Orientation, Size, Variant } from '../types.js';

export type SurfaceRadius = BaseSize | 'capsule';

export interface SurfaceProps {
	children?: Snippet;
	stylesOverride?: HTMLAttributes<HTMLDivElement>;
	spacing?: Size;
	orientation?: Orientation;
	width?: Dimension;
	height?: Dimension;
	radius?: SurfaceRadius;
	variant?: Variant;
	tint?: Color;
	shadow?: boolean;
	hoverEffect?: BaseSize;
}

export const SURFACE_STYLING_SCALE_VALUES = {
	spacing: {
		'x-small': '0.25rem',
		small: '0.5rem',
		medium: '1rem',
		large: '1.5rem',
		'x-large': '2rem'
	},
	hover: { small: '2%', medium: '4%', large: '8%' },
	glow: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
	radius: { small: '0.5rem', medium: '1.5rem', large: '2.5rem', capsule: '4rem' }
};
