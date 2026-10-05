import type { Snippet } from 'svelte';
import type { BaseSize, Color, Variant } from '../types.js';

/** Paint options for the surface class helper; geometry belongs to the element. */
export interface SurfaceOptions {
	variant?: Variant;
	color?: Color;
	shadow?: BaseSize;
	hover?: BaseSize;
}

/** Optional semantic colors, supplied as CSS hex values. */
export type Palette = Partial<Record<Color, `#${string}`>>;

export interface ThemeProps {
	children?: Snippet;
	/** A shared palette or separate light and dark palettes. */
	palette?: Palette | { dark: Palette; light: Palette };
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeModeToggleProps {
	/** Initial or bound theme mode; auto follows the system preference. */
	mode?: ThemeMode;
}
