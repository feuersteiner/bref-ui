import type { TreeIndex } from './state.js';

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
				if (result === expanded) result = { ...expanded };
				result[parentId] = true;
			}
			parentId = index.items.get(parentId)?.parentId;
		}
	}
	return result;
};
