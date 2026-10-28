import type { HTMLInputAttributes } from 'svelte/elements';
import type { SelectProps, SelectOptionDataProps, SelectEmptyProps } from '../select/types.js';
import type { Variant } from '../types.js';

export type ComboboxNativeProps = Pick<
	HTMLInputAttributes,
	| 'title'
	| 'autocomplete'
	| 'autofocus'
	| 'tabindex'
	| 'readonly'
	| 'name'
	| 'form'
	| 'required'
	| 'aria-label'
	| 'aria-labelledby'
	| 'aria-describedby'
	| 'aria-invalid'
	| 'aria-errormessage'
	| 'oninput'
	| 'onkeydown'
	| 'onblur'
	| 'onfocus'
	| 'onclick'
	| 'oncompositionstart'
	| 'oncompositionend'
>;

export interface ComboboxProps extends SelectProps, ComboboxNativeProps {
	wide?: boolean;
	variant?: Exclude<Variant, 'filled'>;
}

export interface ComboboxInputProps {
	attributes: ComboboxNativeProps;
	id: string;
	placeholder: string;
	size: NonNullable<SelectProps['size']>;
	disabled: boolean;
	wide: boolean;
	variant: NonNullable<ComboboxProps['variant']>;
	display: string;
	selected: readonly SelectOptionDataProps[];
	editing: boolean;
	results: readonly SelectOptionDataProps[];
	listId: string;
	open: boolean;
	activeId?: string;
	input?: HTMLInputElement;
	onSearch: (query: string) => void;
	onSelect: (id: string) => void;
	onCancel: () => void;
}

export interface ComboboxListProps {
	id: string;
	items: readonly SelectOptionDataProps[];
	selectedIds: readonly string[];
	activeId?: string;
	multiple: boolean;
	size: NonNullable<SelectProps['size']>;
	emptyMessage: SelectEmptyProps;
	'aria-label'?: HTMLInputAttributes['aria-label'];
	'aria-labelledby'?: HTMLInputAttributes['aria-labelledby'];
	onSelect: (id: string) => void;
}

export interface ComboboxOptionProps {
	id: string;
	item: SelectOptionDataProps;
	selected: boolean;
	active: boolean;
	onSelect: () => void;
}

export interface ComboboxFormProps {
	items: readonly SelectOptionDataProps[];
	selectedIds: readonly string[];
	value?: string | string[];
	name?: HTMLInputAttributes['name'];
	form?: HTMLInputAttributes['form'];
	required?: HTMLInputAttributes['required'];
	disabled: boolean;
	multiple: boolean;
	placeholder: string;
	input?: HTMLInputElement;
	display: string;
	onReset: () => void;
}
