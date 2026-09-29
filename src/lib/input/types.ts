import type { HTMLInputAttributes } from 'svelte/elements';
import type { BaseSize } from '../types.js';

type NativeInputProps = Omit<HTMLInputAttributes, 'size' | 'type' | 'value'>;
interface InputStyleProps {
	size?: BaseSize;
	variant?: 'neutral' | 'soft';
	htmlSize?: number;
	ref?: HTMLInputElement;
}

export type InputProps = NativeInputProps &
	InputStyleProps &
	(
		| { type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'; value?: string }
		| { type: 'number'; value?: number | undefined }
	);
