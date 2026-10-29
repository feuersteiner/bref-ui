import type { HTMLInputAttributes } from 'svelte/elements';
import type { Size } from 'bref-ui/types';

export type CheckboxProps = Omit<HTMLInputAttributes, 'type' | 'size' | 'checked'> & {
	size?: Size;
	checked?: boolean;
};
