import type { Snippet } from 'svelte';
import type { Color } from '../types.js';

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
