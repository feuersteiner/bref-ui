import type { HTMLAttributes } from 'svelte/elements';
import type { PillGroupItem } from '../pill-group/types.js';
import type { PillProps } from '../pill/types.js';

export type PillChoiceGroupProps = Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'color'> & {
	items: readonly PillGroupItem[];
	label: string;
	selection?: 'single' | 'multiple';
	selectedIds?: string[];
	name?: string;
	disabled?: boolean;
	size?: PillProps['size'];
	variant?: PillProps['variant'];
	ref?: HTMLUListElement | undefined;
};
