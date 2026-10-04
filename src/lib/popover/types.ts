import type { Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';

export interface PopoverTriggerProps {
	popovertarget: string;
	'aria-controls': string;
	'aria-expanded': boolean;
	[key: symbol]: Attachment<HTMLElement>;
}

export interface PopoverProps {
	trigger: Snippet<[PopoverTriggerProps]>;
	children: Snippet;
	open?: boolean;
}
