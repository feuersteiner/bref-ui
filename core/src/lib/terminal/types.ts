import type { HTMLAttributes } from 'svelte/elements';

export interface TerminalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Plain-text output, rendered in order with a newline between entries. */
	lines: readonly string[];
	/** Visible window title and default accessible name. */
	windowTitle?: string;
}
