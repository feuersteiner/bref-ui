import type { Snippet } from 'svelte';

export interface PopoverProps {
	trigger: Snippet;
	children: Snippet;
	open?: boolean;
}
