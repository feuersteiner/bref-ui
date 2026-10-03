import type { HTMLInputAttributes } from 'svelte/elements';
import type { BaseSize } from '../types.js';

export interface SwitchProps extends Omit<HTMLInputAttributes, 'type' | 'size' | 'checked'> {
	checked?: boolean;
	size?: BaseSize;
	ref?: HTMLInputElement | undefined;
}
