import type { Snippet } from 'svelte';
import type { BaseSize, Color, Dimension, Orientation, Size, Variant } from '../types.js';

export type SurfaceRadius = Size | `${number}rem` | `${number}%`;

export interface SurfaceProps {
	/** Native root element; defaults to div. */
	as?: 'div' | 'section' | 'span';
	children?: Snippet;
	/** Surface tint; defaults to background. Text color inherits. */
	tint?: Color;
	/** Transparent wrapper, frosted glass, or opaque panel. */
	variant?: Variant;
	/** Shared padding and gap; omitted spacing means none. */
	spacing?: Size;
	orientation?: Orientation;
	width?: Dimension;
	height?: Dimension;
	/** Corner radius; omitted radius means zero. */
	radius?: SurfaceRadius;
	shadow?: boolean;
	/** Optional hover treatment strength. */
	hover?: BaseSize;
	/** Enable scrolling; false or omitted keeps overflow visible. */
	scroll?: boolean;
}
