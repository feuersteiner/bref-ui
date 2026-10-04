import type { BaseSize } from '../types.js';
import type { IconName } from '../icon/types.js';

interface SelectIconProps {
	name: IconName;
	filled?: boolean;
}

export interface SelectOptionDataProps {
	id: string;
	label: string;
	icon?: SelectIconProps;
	disabled?: boolean;
}

export interface SelectEmptyProps {
	message: string;
	icon?: SelectIconProps;
}

export interface SelectProps {
	id?: string;
	items: readonly SelectOptionDataProps[];
	value?: string | string[];
	onChange?: (value: string | string[]) => void;
	placeholder?: string;
	size?: BaseSize;
	disabled?: boolean;
	emptyMessage?: SelectEmptyProps;
}

export interface SelectTriggerProps {
	id?: string;
	panelId: string;
	selected: readonly SelectOptionDataProps[];
	placeholder: string;
	disabled?: boolean;
}

export interface SelectListProps {
	id: string;
	items: readonly SelectOptionDataProps[];
	value?: string | string[];
	emptyMessage: SelectEmptyProps;
	onSelect: (id: string) => void;
}

export interface OptionProps extends SelectOptionDataProps {
	selected: boolean;
	multiple: boolean;
	panelId: string;
	onSelect: () => void;
}
