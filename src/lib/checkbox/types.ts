import type { HTMLInputAttributes } from 'svelte/elements';

export type CheckboxProps = Omit<HTMLInputAttributes, 'type' | 'size' | 'checked'> & {
	size?: 'small' | 'medium' | 'large';
	checked?: boolean;
	indeterminate?: boolean;
	ref?: HTMLInputElement | undefined;
};
