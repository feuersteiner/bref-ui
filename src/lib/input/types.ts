import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
import type { BaseSize, Variant } from '../types.js';
import type { IconProps } from '../icon/types.js';

export interface InputBaseProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	icon?: IconProps;
	size?: BaseSize;
	disabled?: boolean;
	multiline?: boolean;
	resizable?: boolean;
	rows?: number;
	wide?: boolean;
	variant?: Exclude<Variant, 'filled'>;
}

export type InputProps = InputBaseProps &
	(
		| ({ multiline?: false } & Omit<HTMLInputAttributes, keyof InputBaseProps>)
		| ({ multiline: true } & Omit<HTMLTextareaAttributes, keyof InputBaseProps>)
	);
