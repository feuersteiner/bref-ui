import type { HTMLInputAttributes } from 'svelte/elements';
import type { Size } from '../types.js';

export type CheckboxProps = Omit<HTMLInputAttributes, 'type' | 'size' | 'checked'> & {
	size?: Size;
	checked?: boolean;
};
