import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { BaseSize } from '../types.js';

export interface TreeItem {
	id: string;
	label: string;
	children?: readonly TreeItem[];
	disabled?: boolean;
}

type NativeTreeAttributes = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'aria-label' | 'aria-labelledby'
>;

type TreeName =
	| { 'aria-label': string; 'aria-labelledby'?: string }
	| { 'aria-label'?: string; 'aria-labelledby': string };

export type TreeViewProps = NativeTreeAttributes &
	TreeName & {
		items: readonly TreeItem[];
		size?: BaseSize;
		selection?: 'single' | 'multiple';
		selectedIds?: string[];
		expandedIds?: string[];
		item?: Snippet<[TreeItem]>;
		ref?: HTMLDivElement;
	};
