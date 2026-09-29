import type { BaseSize } from '../types.js';

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SelectProps {
	options: readonly SelectOption[];
	value?: string;
	name?: string;
	form?: string;
	required?: boolean;
	disabled?: boolean;
	placeholder?: string;
	size?: BaseSize;
	id?: string;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
}
