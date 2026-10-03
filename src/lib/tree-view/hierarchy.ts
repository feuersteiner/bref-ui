import type { TreeItemProps, TreeSectionProps, TreeIndex, VisibleItem } from './types.js';

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

export const revealSelection = (
	index: TreeIndex,
	expanded: Record<string, boolean>,
	previous: readonly string[],
	selected: readonly string[]
): Record<string, boolean> => {
	const existing = new Set(previous);
	let result = expanded;
	for (const id of selected) {
		if (existing.has(id)) continue;
		let parentId = index.items.get(id)?.parentId;
		while (parentId !== undefined) {
			if (result[parentId] !== true) {
				if (result === expanded) result = Object.assign(Object.create(null), expanded);
				result[parentId] = true;
			}
			parentId = index.items.get(parentId)?.parentId;
		}
	}
	return result;
};
