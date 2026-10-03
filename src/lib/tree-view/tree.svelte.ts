import { untrack } from 'svelte';
import { childrenFor, indexTree, rootsFor, visibleItems, revealSelection } from './hierarchy.js';
import { trackTreeFocus } from './focus.js';
import type { TreeExpansion, TreeItemProps, TreeNodeData, TreeViewProps } from './types.js';

export const createTree = (
	props: () => TreeViewProps,
	setSelection: (selection: string | string[]) => void
) => {
	const initialExpanded = untrack(() => props().defaultExpanded ?? false);
	const indexed = $derived(indexTree(props().items, props().sections));
	const selection = $derived(props().selection);
	// A fresh identity for each selection change also distinguishes A → B → A.
	const requested = $derived(
		Array.isArray(selection) ? [...selection] : selection === undefined ? [] : [selection]
	);
	const selected = $derived(
		requested.filter((id) => indexed.items.has(id) && !indexed.items.get(id)?.disabled)
	);
	let manual = $state.raw<TreeExpansion>({ expanded: Object.create(null), selection: [] });
	const expanded = $derived(
		revealSelection(
			indexed,
			manual.expanded,
			manual.selection === requested ? selected : [],
			selected
		)
	);
	const visible = $derived(visibleItems(indexed, expanded, initialExpanded));
	let focusId = $state<string>();
	const activeId = $derived(
		visible.some(({ item }) => item.id === focusId)
			? focusId
			: (visible.find(({ item }) => selected.includes(item.id))?.item.id ?? visible[0]?.item.id)
	);
	let element: HTMLDivElement;

	const focus = (id: string) => {
		focusId = id;
		Array.from(element.querySelectorAll<HTMLElement>('[role="treeitem"]'))
			.find((node) => node.dataset.treeId === id)
			?.focus();
	};
	const rememberExpansion = () => {
		manual = { expanded: Object.assign(Object.create(null), expanded), selection: requested };
	};
	const toggle = (id: string) => {
		if (!childrenFor(indexed, id).length) return;
		rememberExpansion();
		manual = {
			...manual,
			expanded: Object.assign(Object.create(null), manual.expanded, {
				[id]: !(expanded[id] ?? initialExpanded)
			})
		};
		focus(id);
	};
	const select = (id: string) => {
		if (!indexed.items.get(id)?.disabled) {
			rememberExpansion();
			setSelection(
				Array.isArray(props().selection)
					? selected.includes(id)
						? selected.filter((value) => value !== id)
						: [...selected, id]
					: id
			);
		}
		focus(id);
	};
	const remove = (id: string) => {
		if (indexed.items.get(id)?.disabled) return;
		rememberExpansion();
		focus(id);
		props().onDelete?.(id);
	};
	const actions = $derived({
		focus,
		select,
		toggle,
		remove: props().onDelete ? remove : undefined,
		trackFocus: trackTreeFocus(() => ({ element, visible, indexed, focus }))
	});
	const groups = $derived.by(() => {
		const nodesFor = (nodes: TreeItemProps[], level: number): TreeNodeData[] =>
			nodes.map((item, position) => ({
				...item,
				level,
				position: position + 1,
				siblingCount: nodes.length,
				open: expanded[item.id] ?? initialExpanded,
				selected: selected.includes(item.id),
				tabIndex: activeId === item.id ? 0 : -1,
				items: nodesFor(childrenFor(indexed, item.id), level + 1)
			}));
		return indexed.sections.map((section) => ({
			section,
			items: nodesFor(rootsFor(indexed, section?.id), 0)
		}));
	});

	return {
		get element() {
			return element;
		},
		set element(value: HTMLDivElement) {
			element = value;
		},
		get indexed() {
			return indexed;
		},
		get visible() {
			return visible;
		},
		get expanded() {
			return expanded;
		},
		get activeId() {
			return activeId;
		},
		get groups() {
			return groups;
		},
		get actions() {
			return actions;
		},
		initialExpanded
	};
};
