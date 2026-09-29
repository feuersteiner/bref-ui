import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
import type { PillProps } from '../pill/types.js';

export interface PillGroupItem {
	id: string;
	label: string;
}

export type PillGroupProps = Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'color'> & {
	items: readonly PillGroupItem[];
	color?: PillProps['color'];
	size?: PillProps['size'];
	variant?: PillProps['variant'];
	renderItem?: Snippet<[PillGroupItem]>;
	ref?: HTMLUListElement | undefined;
};
