import type { HTMLAttributes } from 'svelte/elements';
import type { Color, Size } from '../types.js';
import type { IconName } from './names.js';

export type { IconName } from './names.js';

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'color'> {
	/** Material Symbols identifier. */
	name: IconName;
	/** Use the filled glyph variant. */
	filled?: boolean;
	/** Accessible name; omit for decorative icons. */
	label?: string;
	/** Omitted sizes inherit the surrounding font size. */
	size?: Size;
	/** Omitted colors inherit the surrounding text color. */
	color?: Color;
}
