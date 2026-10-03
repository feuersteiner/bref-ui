import type { HTMLProgressAttributes } from 'svelte/elements';
import type { BaseSize, Color } from '../types.js';

type ProgressBaseProps = Omit<HTMLProgressAttributes, 'value' | 'max' | 'size' | 'color'> & {
	/** Accessible name for the indicator or seek control. */
	label: string;
	/** Maximum progress; must be finite and greater than zero. */
	max?: number;
	size?: BaseSize;
	color?: Color;
	ref?: HTMLProgressElement | null;
};

type IndicatorProps = ProgressBaseProps & {
	/** Omit for indeterminate progress. */
	value?: number;
	onSeek?: never;
	onSeekCommit?: never;
	disabled?: never;
};

type SeekableProps = ProgressBaseProps & {
	value: number;
	/** Called as the user moves the native range control. Update value to accept the change. */
	onSeek: (value: number) => void;
	/** Called when the interaction ends. */
	onSeekCommit?: (value: number) => void;
	disabled?: boolean;
};

export type ProgressProps = IndicatorProps | SeekableProps;
