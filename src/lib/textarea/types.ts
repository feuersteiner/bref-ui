import type { HTMLTextareaAttributes } from 'svelte/elements';
import type { BaseSize } from '../types.js';

export type TextareaProps = Omit<HTMLTextareaAttributes, 'value'> & {
	value?: string;
	size?: BaseSize;
	variant?: 'neutral' | 'soft';
	resizable?: boolean;
	ref?: HTMLTextAreaElement;
};
