import { tick } from 'svelte';
import type { TreeFocus, VisibleItem } from './types.js';

/** Restore DOM focus only when the focused row is destroyed, never when focus is elsewhere. */
export const trackTreeFocus = (current: () => TreeFocus) => (node: HTMLElement) => {
	let previous = current().visible;
	let focused = false;
	const onFocus = (event: FocusEvent) => {
		focused = (event.target as HTMLElement).closest('[role="treeitem"]') === node;
		if (focused) previous = current().visible;
	};
	const onBlur = (event: FocusEvent) => {
		if (event.relatedTarget) focused = node.contains(event.relatedTarget as Node);
		else
			queueMicrotask(() => {
				// Removing a focused row also emits blur before it leaves the DOM.
				if (node.isConnected && !node.contains(document.activeElement)) focused = false;
			});
	};
	node.addEventListener('focusin', onFocus);
	node.addEventListener('focusout', onBlur);
	return {
		destroy: () => {
			node.removeEventListener('focusin', onFocus);
			node.removeEventListener('focusout', onBlur);
			if (
				!focused ||
				(document.activeElement !== document.body && !node.contains(document.activeElement))
			)
				return;
			void tick().then(() => {
				const { element, visible, indexed, focus } = current();
				if (
					!element?.isConnected ||
					(document.activeElement !== document.body && !node.contains(document.activeElement))
				)
					return;
				const id = node.dataset.treeId!;
				const next = nextFocusAfterChange(previous, visible, id, indexed.items.has(id));
				if (next !== undefined) focus(next);
				else element.focus();
			});
		}
	};
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
