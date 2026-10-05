import type { BaseSize } from '../types.js';
import type { IconProps } from '../icon/types.js';

export interface SelectOptionDataProps {
	id: string;
	label: string;
	icon?: Pick<IconProps, 'name' | 'filled'>;
	disabled?: boolean;
}

export interface SelectEmptyProps extends Pick<SelectOptionDataProps, 'icon'> {
	message: string;
}

export interface SelectProps extends Partial<Pick<SelectOptionDataProps, 'id' | 'disabled'>> {
	items: readonly SelectOptionDataProps[];
	value?: string | string[];
	onChange?: (value: string | string[]) => void;
	placeholder?: string;
	size?: BaseSize;
	emptyMessage?: SelectEmptyProps;
}

export interface SelectTriggerProps
	extends
		Pick<SelectProps, 'id' | 'disabled' | 'size'>,
		Required<Pick<SelectProps, 'placeholder'>> {
	open: boolean;
	selected: readonly SelectOptionDataProps[];
	onToggle: () => void;
}

export interface SelectListProps
	extends Pick<SelectProps, 'items' | 'value'>, Required<Pick<SelectProps, 'emptyMessage'>> {
	onSelect: (id: string) => void;
}

export interface OptionProps extends SelectOptionDataProps {
	selected: boolean;
	onSelect: () => void;
}
