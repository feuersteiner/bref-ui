import type { HTMLAttributes } from 'svelte/elements';
import type { BaseSize, Color, Dimension, Orientation, Size, Variant } from '../types.js';

export type SurfaceRadius = Size | `${number}rem` | `${number}%`;

/** Shared paint props for the surface helper and Surface component. */
export interface SurfaceBaseProps {
	variant?: Variant;
	color?: Color;
	/** Shadow strength; true enables the medium shadow and false disables it. */
	shadow?: BaseSize | boolean;
	/** Optional hover treatment strength. */
	hover?: BaseSize;
}

export interface SurfaceProps extends SurfaceBaseProps, Omit<HTMLAttributes<HTMLElement>, 'color'> {
	/** Native root element; defaults to div. */
	as?: 'div' | 'section' | 'span';
	/** Shared padding and gap; omitted spacing means none. */
	spacing?: Size;
	orientation?: Orientation;
	width?: Dimension;
	height?: Dimension;
	/** Corner radius; omitted radius means zero. */
	radius?: SurfaceRadius;
	/** Enable scrolling; false or omitted keeps overflow visible. */
	scroll?: boolean;
}
