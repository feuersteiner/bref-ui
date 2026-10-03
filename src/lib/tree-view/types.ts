import type { IconProps, BaseSize } from '../types.js';

export interface TreeItemProps {
	id: string;
	label: string;
	icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
	parentId?: string;
	sectionId?: string;
	disabled?: boolean;
}

export type TreeSectionProps = Pick<TreeItemProps, 'id' | 'label' | 'icon'>;

export interface TreeViewProps {
	items: TreeItemProps[];
	sections?: TreeSectionProps[];
	label?: string;
	size?: BaseSize;
	/** Bindable node selection; newly selected nodes reveal their ancestors. */
	selection?: string | string[];
	defaultExpanded?: boolean;
	onDelete?: (id: string) => void;
}
