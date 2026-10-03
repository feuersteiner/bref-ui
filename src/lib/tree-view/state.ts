import type { TreeItemProps, TreeSectionProps } from './types.js';

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

const rootKey = (sectionId?: string) => `root:${JSON.stringify(sectionId)}`;
const childKey = (id: string) => `child:${id}`;

export const indexTree = (items: TreeItemProps[], sections: TreeSectionProps[] = []): TreeIndex => {
	const indexed = new Map<string, TreeItemProps>();
	const children = new Map<string, TreeItemProps[]>();
	const sectionIds = new Set<string>();
	for (const section of sections) {
		if (sectionIds.has(section.id))
			throw new Error(`TreeView section ID is duplicated: ${section.id}`);
		sectionIds.add(section.id);
	}
	for (const item of items) {
		if (indexed.has(item.id)) throw new Error(`TreeView item ID is duplicated: ${item.id}`);
		if (item.sectionId !== undefined && !sectionIds.has(item.sectionId))
			throw new Error(`TreeView item ${item.id} has an unknown section: ${item.sectionId}`);
		indexed.set(item.id, item);
	}
	for (const item of items) {
		if (item.parentId !== undefined) {
			const parent = indexed.get(item.parentId);
			if (!parent)
				throw new Error(`TreeView item ${item.id} has an unknown parent: ${item.parentId}`);
			if (parent.sectionId !== item.sectionId)
				throw new Error(`TreeView item ${item.id} crosses a section boundary`);
		}
		const key = item.parentId === undefined ? rootKey(item.sectionId) : childKey(item.parentId);
		const siblings = children.get(key) ?? [];
		siblings.push(item);
		children.set(key, siblings);
	}
	const done = new Set<string>();
	for (const item of items) {
		const visiting = new Set<string>();
		let cursor: TreeItemProps | undefined = item;
		while (cursor && !done.has(cursor.id)) {
			if (visiting.has(cursor.id)) throw new Error('TreeView items contain a cycle');
			visiting.add(cursor.id);
			cursor = cursor.parentId === undefined ? undefined : indexed.get(cursor.parentId);
		}
		for (const id of visiting) done.add(id);
	}
	return { items: indexed, children, sections: [undefined, ...sections] };
};

export const rootsFor = (index: TreeIndex, sectionId?: string) =>
	index.children.get(rootKey(sectionId)) ?? [];

export const childrenFor = (index: TreeIndex, id: string) => index.children.get(childKey(id)) ?? [];

export const visibleItems = (
	index: TreeIndex,
	expanded: Record<string, boolean>,
	defaultExpanded: boolean
): VisibleItem[] => {
	const result: VisibleItem[] = [];
	const visit = (nodes: TreeItemProps[], parentId: string | undefined, level: number) => {
		for (const item of nodes) {
			result.push({ item, parentId, level });
			if (childrenFor(index, item.id).length && (expanded[item.id] ?? defaultExpanded))
				visit(childrenFor(index, item.id), item.id, level + 1);
		}
	};
	for (const section of index.sections) visit(rootsFor(index, section?.id), undefined, 1);
	return result;
};

export const nextFocusAfterChange = (
	previous: readonly VisibleItem[],
	current: readonly VisibleItem[],
	focusedId: string,
	preferAncestor = true
): string | undefined => {
	if (current.some(({ item }) => item.id === focusedId)) return focusedId;
	const previousIndex = previous.findIndex(({ item }) => item.id === focusedId);
	const survivors = new Set(current.map(({ item }) => item.id));
	if (preferAncestor) {
		let ancestor = previous.find(({ item }) => item.id === focusedId)?.parentId;
		while (ancestor !== undefined) {
			if (survivors.has(ancestor)) return ancestor;
			ancestor = previous.find(({ item }) => item.id === ancestor)?.parentId;
		}
	}
	for (let distance = 1; distance < previous.length; distance++) {
		const after = previous[previousIndex + distance]?.item.id;
		if (after !== undefined && survivors.has(after)) return after;
		const before = previous[previousIndex - distance]?.item.id;
		if (before !== undefined && survivors.has(before)) return before;
	}
	return current[0]?.item.id;
};

export const typeaheadMatch = (
	visible: readonly VisibleItem[],
	currentId: string,
	query: string
): string | undefined => {
	if (!visible.length) return;
	const start = visible.findIndex(({ item }) => item.id === currentId);
	for (let offset = 1; offset <= visible.length; offset++) {
		const candidate = visible[(start + offset) % visible.length].item;
		if (candidate.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))
			return candidate.id;
	}
};

export const keyboardTarget = (
	visible: readonly VisibleItem[],
	index: TreeIndex,
	expanded: Record<string, boolean>,
	defaultExpanded: boolean,
	currentId: string,
	key: string
): { focusId?: string; toggleId?: string } => {
	const current = visible.findIndex(({ item }) => item.id === currentId);
	const entry = visible[current];
	if (!entry) return {};
	switch (key) {
		case 'ArrowDown':
			return { focusId: visible[Math.min(current + 1, visible.length - 1)]?.item.id };
		case 'ArrowUp':
			return { focusId: visible[Math.max(current - 1, 0)]?.item.id };
		case 'Home':
			return { focusId: visible[0]?.item.id };
		case 'End':
			return { focusId: visible.at(-1)?.item.id };
		case 'ArrowRight':
			if (!childrenFor(index, currentId).length) return {};
			return (expanded[currentId] ?? defaultExpanded)
				? { focusId: visible[current + 1]?.item.id }
				: { toggleId: currentId };
		case 'ArrowLeft':
			return childrenFor(index, currentId).length && (expanded[currentId] ?? defaultExpanded)
				? { toggleId: currentId }
				: { focusId: entry.parentId };
		default:
			return {};
	}
};
