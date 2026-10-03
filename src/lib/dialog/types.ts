import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';

export type DialogProps = Omit<
	HTMLDialogAttributes,
	'open' | 'children' | 'title' | 'aria-labelledby' | 'aria-describedby'
> & {
	open?: boolean;
	title: string;
	description?: string;
	children?: Snippet;
	dismissible?: boolean;
	closeOnBackdropClick?: boolean;
};
