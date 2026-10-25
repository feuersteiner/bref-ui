import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { BaseSize } from '../types.js';

export interface SwitchProps extends Omit<
	HTMLInputAttributes,
	'type' | 'size' | 'checked' | 'children'
> {
	checked?: boolean;
	size?: BaseSize;
	children?: Snippet;
}
