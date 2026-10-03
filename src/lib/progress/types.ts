import type { HTMLProgressAttributes } from 'svelte/elements';
import type { BaseSize } from '../types.js';

export type ProgressProps = Omit<HTMLProgressAttributes, 'value' | 'max' | 'size' | 'color'> & {
	/** Normalized progress from 0 to 1; omit for indeterminate progress. */
	value?: number;
	label?: string;
	size?: BaseSize;
	/** Called with a normalized value when the user edits the seek control. */
	onSeek?: (value: number) => void;
	disabled?: boolean;
};
