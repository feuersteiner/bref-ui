import type { BaseSize, IconProps } from '../types.js';

export interface TreeItemProps {
	id: string;
	label: string;
	icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
	children?: TreeItemProps[];
	disabled?: boolean;
}

export interface TreeSectionProps extends Pick<TreeItemProps, 'id' | 'label' | 'icon'> {
	items: TreeItemProps[];
}

export interface TreeViewProps {
	items: TreeItemProps[];
	sections?: TreeSectionProps[];
	label?: string;
	size?: BaseSize;
	selection?: string | string[];
	defaultExpanded?: boolean;
	onDelete?: (id: string) => void;
}

export interface TreeNodeProps extends Pick<
	TreeViewProps,
	'selection' | 'defaultExpanded' | 'onDelete'
> {
	item: TreeItemProps;
}
