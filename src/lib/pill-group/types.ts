import type { HTMLAttributes } from 'svelte/elements';
import type { PillDataProps, PillProps } from '../pill/types.js';
import type { Snippet } from 'svelte';

export type PillGroupProps = Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'color'> & {
	items: readonly PillDataProps[];
	onDelete?: (id: string) => void;
	color?: PillProps['color'];
	size?: PillProps['size'];
	variant?: PillProps['variant'];
};
export type PillGroupContainerProps = Omit<HTMLAttributes<HTMLUListElement>, 'children'> &
	Pick<PillGroupProps, 'items' | 'size'> & {
		renderItem: Snippet<[PillDataProps]>;
	};
