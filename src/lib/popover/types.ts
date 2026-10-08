import type { SurfaceProps } from '../surface/types.ts';
import type { Snippet } from 'svelte';

export interface PopoverProps extends Pick<
	SurfaceProps,
	| 'as'
	| 'variant'
	| 'color'
	| 'shadow'
	| 'hover'
	| 'spacing'
	| 'orientation'
	| 'width'
	| 'height'
	| 'radius'
	| 'scroll'
	| 'class'
	| 'style'
> {
	trigger: Snippet;
	children: Snippet;
	open?: boolean;
	disabled?: boolean;
}
