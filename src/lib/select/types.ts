import type { HTMLSelectAttributes } from 'svelte/elements';
import type { BaseSize, Variant } from '../types.js';
import type { IconProps } from '../icon/types.js';

export interface SelectOptionDataProps {
	id: string;
	label: string;
	icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
	disabled?: boolean;
}

export interface SelectBaseProps {
	items: readonly SelectOptionDataProps[];
	value?: string | string[];
	onChange?: (value: string | string[]) => void;
	placeholder?: string;
	size?: BaseSize;
	disabled?: boolean;
	wide?: boolean;
	variant?: Exclude<Variant, 'filled'>;
	emptyMessage?: {
		message: string;
		icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
	};
}

export type SelectProps = SelectBaseProps &
	Omit<HTMLSelectAttributes, keyof SelectBaseProps | 'children' | 'multiple'>;
