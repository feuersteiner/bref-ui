import type { HTMLInputAttributes } from 'svelte/elements';
import type { BaseSize } from '../types.js';
import type { SelectOption } from '../select/types.js';

export type ComboboxProps = Omit<
	HTMLInputAttributes,
	| 'type'
	| 'value'
	| 'size'
	| 'name'
	| 'form'
	| 'required'
	| 'disabled'
	| 'oninput'
	| 'onkeydown'
	| 'onblur'
> & {
	options: readonly SelectOption[];
	value?: string;
	name?: string;
	form?: string;
	required?: boolean;
	disabled?: boolean;
	size?: BaseSize;
	variant?: 'neutral' | 'soft';
	filter?: boolean;
	loading?: boolean;
	error?: string;
	emptyMessage?: string;
	oninput?: HTMLInputAttributes['oninput'];
	onkeydown?: HTMLInputAttributes['onkeydown'];
	onblur?: HTMLInputAttributes['onblur'];
};
