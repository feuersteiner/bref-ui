import type { HTMLInputAttributes } from 'svelte/elements';
import type { SelectBaseProps } from '../select/types.js';

export type ComboboxProps = SelectBaseProps &
	Omit<HTMLInputAttributes, keyof SelectBaseProps | 'children' | 'type'>;
