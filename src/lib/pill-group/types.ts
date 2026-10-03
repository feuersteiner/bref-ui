import type { HTMLAttributes } from 'svelte/elements';
import type { PillDataProps, PillProps } from '../pill/types.js';

export type PillGroupProps = Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'color'> & {
	items: readonly PillDataProps[];
	onDelete?: (id: string) => void;
	color?: PillProps['color'];
	size?: PillProps['size'];
	variant?: PillProps['variant'];
};
