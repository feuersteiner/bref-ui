import type { HTMLAttributes } from 'svelte/elements';
import type { Size, Variant } from '../types.js';
import type { PillDataProps } from '../pill/types.js';

export type PillChoiceGroupProps = Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'color'> & {
	items: readonly PillDataProps[];
	onDelete?: (id: string) => void;
	selection: string | string[];
	disabled?: boolean;
	size?: Size;
	variant?: Exclude<Variant, 'filled'>;
};
