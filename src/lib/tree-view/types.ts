import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { BaseSize, IconProps } from '../types.js';

export interface TreeItemProps {
	id: string;
	label: string;
	icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
	children?: TreeItemProps[];
	disabled?: boolean;
}

export interface TreeSectionProps extends Pick<TreeItemProps, 'id' | 'label' | 'icon'> {
	description?: string;
	items: TreeItemProps[];
}

export interface TreeViewProps {
	items: TreeItemProps[];
	sections?: TreeSectionProps[];
	label?: string;
	size?: BaseSize;
	glass?: boolean;
	selection?: string | string[];
	defaultExpanded?: boolean;
	onDelete?: (id: string) => void;
	node?: Snippet<[TreeItemProps]>;
}

export interface TreeNodeProps extends Pick<
	TreeViewProps,
	'selection' | 'defaultExpanded' | 'onDelete' | 'glass'
> {
	item: TreeItemProps;
	indent?: number;
}

export interface TreeNodeContentProps extends HTMLButtonAttributes {
	item: TreeItemProps;
}
