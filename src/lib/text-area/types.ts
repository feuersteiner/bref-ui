import type { HTMLTextareaAttributes } from 'svelte/elements';
import type { BaseSize, Variant } from '../types.js';
import type { IconProps } from '../icon/types.js';

export type TextAreaProps = Omit<HTMLTextareaAttributes, 'value'> & {
	value?: string;
	onChange?: (value: string) => void;
	icon?: IconProps;
	size?: BaseSize;
	wide?: boolean;
	variant?: Exclude<Variant, 'filled'>;
	resizable?: boolean;
};
