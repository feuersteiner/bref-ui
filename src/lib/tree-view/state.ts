import type { TreeItem } from './types.js';

export interface VisibleItem {
	item: TreeItem;
	parentId?: string;
	level: number;
}

export const indexTree = (items: readonly TreeItem[]): Map<string, TreeItem> => {
	const indexed = new Map<string, TreeItem>();
	const ancestors = new Set<TreeItem>();
	const visit = (nodes: readonly TreeItem[]) => {
		for (const node of nodes) {
			if (ancestors.has(node)) throw new Error('TreeView items contain a cycle');
			if (indexed.has(node.id)) throw new Error(`TreeView item ID is duplicated: ${node.id}`);
			indexed.set(node.id, node);
			ancestors.add(node);
			if (node.children) visit(node.children);
			ancestors.delete(node);
		}
	};
	visit(items);
	return indexed;
};

export const visibleItems = (
	items: readonly TreeItem[],
	expandedIds: readonly string[]
): VisibleItem[] => {
	const expanded = new Set(expandedIds);
	const result: VisibleItem[] = [];
	const visit = (nodes: readonly TreeItem[], parentId: string | undefined, level: number) => {
		for (const item of nodes) {
			result.push({ item, parentId, level });
			if (item.children?.length && expanded.has(item.id)) visit(item.children, item.id, level + 1);
		}
	};
	visit(items, undefined, 1);
	return result;
};

export const validIds = (ids: readonly string[], indexed: Map<string, TreeItem>): string[] => {
	return [...new Set(ids)].filter((id) => indexed.has(id));
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
		while (ancestor) {
			if (survivors.has(ancestor)) return ancestor;
			ancestor = previous.find(({ item }) => item.id === ancestor)?.parentId;
		}
	}
	for (let distance = 1; distance < previous.length; distance++) {
		const after = previous[previousIndex + distance]?.item.id;
		if (after && survivors.has(after)) return after;
		const before = previous[previousIndex - distance]?.item.id;
		if (before && survivors.has(before)) return before;
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
	expandedIds: readonly string[],
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
			if (!entry.item.children?.length) return {};
			return expandedIds.includes(currentId)
				? { focusId: visible[current + 1]?.item.id }
				: { toggleId: currentId };
		case 'ArrowLeft':
			return entry.item.children?.length && expandedIds.includes(currentId)
				? { toggleId: currentId }
				: { focusId: entry.parentId };
		default:
			return {};
	}
};
