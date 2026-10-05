import type { SurfaceProps } from '../surface/types.ts';
import type { Snippet } from 'svelte';

export interface PopoverProps extends SurfaceProps {
	trigger: Snippet;
	children: Snippet;
	open?: boolean;
}
