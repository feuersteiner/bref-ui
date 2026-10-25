import type { HTMLInputAttributes } from 'svelte/elements';
import type { BaseSize, Variant } from '../types.js';
import type { IconProps } from '../icon/types.js';

export type TextInputProps = Omit<HTMLInputAttributes, 'value' | 'size'> & {
	value?: string;
	onChange?: (value: string) => void;
	icon?: IconProps;
	size?: BaseSize;
	wide?: boolean;
	variant?: Exclude<Variant, 'filled'>;
	glass?: boolean;
};
