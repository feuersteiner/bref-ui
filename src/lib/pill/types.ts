import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Color, Size, Variant } from '../types.js';
import type { IconProps } from '../icon/types.js';

export interface PillDataProps {
	id: string;
	label: string;
	icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
}

export type PillProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'color' | 'onclick'> &
	Pick<PillDataProps, 'label' | 'icon'> & {
		children?: Snippet;
		color?: Exclude<Color, 'background'>;
		size?: Size;
		variant?: Variant;
		onClick?: (event: MouseEvent) => void;
		onDelete?: () => void;
		swoosh?: boolean;
	};
