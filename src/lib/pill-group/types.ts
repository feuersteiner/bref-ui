import type { HTMLAttributes } from 'svelte/elements';
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
	ref?: HTMLUListElement | undefined;
};
