import { childrenFor } from './hierarchy.js';
import type { TreeIndex, TreeKeyboard, VisibleItem } from './types.js';

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

export const treeKeyboard = (tree: TreeKeyboard) => {
	let query = '';
	let typedAt = 0;
	return (event: KeyboardEvent) => {
		const target = event.target;
		if (
			!(target instanceof HTMLElement) ||
			(target !== tree.element && target.getAttribute('role') !== 'treeitem')
		)
			return;
		const id = target === tree.element ? tree.activeId : target.dataset.treeId;
		if (id === undefined) return;
		let next: string | undefined;
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
			case 'Home':
			case 'End':
			case 'ArrowRight':
			case 'ArrowLeft': {
				const result = keyboardTarget(
					tree.visible,
					tree.indexed,
					tree.expanded,
					tree.initialExpanded,
					id,
					event.key
				);
				if (result.toggleId !== undefined) tree.actions.toggle(result.toggleId);
				next = result.focusId;
				break;
			}
			case 'Enter':
			case ' ':
				tree.actions.select(id);
				break;
			case 'Delete':
				if (!tree.actions.remove || tree.indexed.items.get(id)?.disabled) return;
				tree.actions.remove(id);
				break;
			default: {
				if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) return;
				const now = Date.now();
				query = now - typedAt > 500 ? event.key : query + event.key;
				typedAt = now;
				const repeated = [...query].every(
					(letter) => letter.toLocaleLowerCase() === event.key.toLocaleLowerCase()
				);
				next = typeaheadMatch(tree.visible, id, repeated ? event.key : query);
			}
		}
		event.preventDefault();
		if (next !== undefined) tree.actions.focus(next);
	};
};
