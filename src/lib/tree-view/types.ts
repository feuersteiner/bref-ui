import type { BaseSize, IconProps } from '../types.js';
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

export interface VisibleItem {
	item: TreeItemProps;
	parentId?: string;
	level: number;
}

export interface TreeIndex {
	items: Map<string, TreeItemProps>;
	children: Map<string, TreeItemProps[]>;
	sections: (TreeSectionProps | undefined)[];
}

export interface TreeNodeData extends TreeItemProps {
	items: TreeNodeData[];
	level: number;
	position: number;
	siblingCount: number;
	open: boolean;
	selected: boolean;
	tabIndex: number;
}

export interface TreeActions {
	focus: (id: string) => void;
	select: (id: string) => void;
	toggle: (id: string) => void;
	remove?: (id: string) => void;
	trackFocus: (element: HTMLElement) => { destroy: () => void };
}

export interface TreeNodeProps {
	node: TreeNodeData;
	actions: TreeActions;
}

export interface TreeViewSectionProps {
	section?: TreeSectionProps;
	items: TreeNodeData[];
	actions: TreeActions;
}

export interface TreeFocus {
	element: HTMLDivElement;
	visible: VisibleItem[];
	indexed: TreeIndex;
	focus: (id: string) => void;
}

export interface TreeKeyboard extends Omit<TreeFocus, 'focus'> {
	expanded: Record<string, boolean>;
	initialExpanded: boolean;
	activeId?: string;
	actions: TreeActions;
}

export interface TreeExpansion {
	expanded: Record<string, boolean>;
	selection: string[];
}
