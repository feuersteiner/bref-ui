<script module lang="ts">
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
</script>

<script lang="ts">
	/* eslint-disable max-lines, func-style, svelte/prefer-svelte-reactivity -- Keep hierarchy processing and coordinated tree state in the container. */
	import { tick, untrack } from 'svelte';
	import TreeViewSection from './tree-view-section.svelte';
	import type { TreeNodeProps } from './tree-node.svelte';
	interface VisibleItem {
		item: TreeItemProps;
		parentId?: string;
		level: number;
	}

	interface TreeIndex {
		items: Map<string, TreeItemProps>;
		children: Map<string, TreeItemProps[]>;
		sections: (TreeSectionProps | undefined)[];
	}

	const rootKey = (sectionId?: string) => `root:${JSON.stringify(sectionId)}`;
	const childKey = (id: string) => `child:${id}`;

	const indexTree = (items: TreeItemProps[], sections: TreeSectionProps[] = []): TreeIndex => {
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

	const rootsFor = (index: TreeIndex, sectionId?: string) =>
		index.children.get(rootKey(sectionId)) ?? [];

	const childrenFor = (index: TreeIndex, id: string) => index.children.get(childKey(id)) ?? [];

	const visibleItems = (
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

	const revealSelection = (
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

	const nextFocusAfterChange = (
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

	const typeaheadMatch = (
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

	const keyboardTarget = (
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

	let {
		items,
		sections = [],
		label,
		size = 'medium',
		selection = $bindable(),
		defaultExpanded = false,
		onDelete
	}: TreeViewProps = $props();

	const initialExpanded = untrack(() => defaultExpanded);
	const indexed = $derived(indexTree(items, sections));
	const selected = $derived(
		(Array.isArray(selection) ? selection : selection === undefined ? [] : [selection]).filter(
			(id) => indexed.items.has(id) && !indexed.items.get(id)?.disabled
		)
	);
	let expanded = $state(untrack(() => revealSelection(indexed, {}, [], selected)));
	const visible = $derived(visibleItems(indexed, expanded, initialExpanded));
	let previousSelection = untrack(() => selected);
	let focusId = $state<string>();
	const activeId = $derived(
		visible.some(({ item }) => item.id === focusId)
			? focusId
			: (visible.find(({ item }) => selected.includes(item.id))?.item.id ?? visible[0]?.item.id)
	);
	let tree: HTMLDivElement;
	let previousVisible: ReturnType<typeof visibleItems> = [];
	let restoreFocus = false;
	let typeahead = '';
	let typeaheadAt = 0;

	$effect.pre(() => {
		const current = selected;
		const index = indexed;
		untrack(() => {
			expanded = revealSelection(index, expanded, previousSelection, current);
			previousSelection = current;
		});
	});

	$effect.pre(() => {
		const current = visible;
		restoreFocus = Boolean(
			focusId !== undefined &&
			!current.some(({ item }) => item.id === focusId) &&
			tree?.contains(document.activeElement)
		);
	});

	$effect(() => {
		const current = visible;
		if (focusId !== undefined && !current.some(({ item }) => item.id === focusId)) {
			focusId = nextFocusAfterChange(previousVisible, current, focusId, indexed.items.has(focusId));
			if (restoreFocus) void tick().then(focusCurrent);
		}
		previousVisible = current;
	});

	function elementFor(id: string): HTMLElement | undefined {
		return Array.from(tree?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? []).find(
			(element) => element.dataset.treeId === id
		);
	}

	function focusCurrent() {
		if (activeId !== undefined) elementFor(activeId)?.focus();
		else tree?.focus();
	}

	function focus(id: string) {
		focusId = id;
		void tick().then(focusCurrent);
	}

	function toggle(id: string) {
		if (childrenFor(indexed, id).length) expanded[id] = !(expanded[id] ?? initialExpanded);
	}

	function select(id: string) {
		if (indexed.items.get(id)?.disabled) return;
		selection = Array.isArray(selection)
			? selected.includes(id)
				? selected.filter((value) => value !== id)
				: [...selected, id]
			: id;
	}

	function deleteNode(id: string) {
		focusId = id;
		onDelete?.(id);
		void tick().then(focusCurrent);
	}

	function onKeydown(event: KeyboardEvent) {
		if (
			event.target !== tree &&
			!(event.target instanceof HTMLElement && event.target.getAttribute('role') === 'treeitem')
		)
			return;
		const id = event.target === tree ? activeId : (event.target as HTMLElement).dataset.treeId;
		if (id === undefined) return;
		let next: string | undefined;
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
			case 'Home':
			case 'End':
			case 'ArrowRight':
			case 'ArrowLeft': {
				const target = keyboardTarget(visible, indexed, expanded, initialExpanded, id, event.key);
				if (target.toggleId !== undefined) toggle(target.toggleId);
				next = target.focusId;
				break;
			}
			case 'Enter':
			case ' ':
				select(id);
				break;
			case 'Delete':
				if (onDelete && !indexed.items.get(id)?.disabled) deleteNode(id);
				else return;
				break;
			default: {
				if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) return;
				const now = Date.now();
				typeahead = now - typeaheadAt > 500 ? event.key : typeahead + event.key;
				typeaheadAt = now;
				next = typeaheadMatch(
					visible,
					id,
					[...typeahead].every(
						(character) => character.toLocaleLowerCase() === event.key.toLocaleLowerCase()
					)
						? event.key
						: typeahead
				);
			}
		}
		event.preventDefault();
		if (next !== undefined) focus(next);
	}

	const groupedItems = $derived.by(() => {
		const nodesFor = (nodes: TreeItemProps[], level: number): TreeNodeProps[] =>
			nodes.map((item, position) => ({
				id: item.id,
				label: item.label,
				icon: item.icon,
				disabled: item.disabled,
				level,
				position: position + 1,
				siblingCount: nodes.length,
				open: expanded[item.id] ?? initialExpanded,
				selected: selected.includes(item.id),
				tabIndex: activeId === item.id ? 0 : -1,
				onFocus: () => (focusId = item.id),
				onClick: () => {
					select(item.id);
					focus(item.id);
				},
				onToggle: () => {
					toggle(item.id);
					focus(item.id);
				},
				onClose: onDelete ? () => deleteNode(item.id) : undefined,
				items: nodesFor(childrenFor(indexed, item.id), level + 1)
			}));
		return indexed.sections.map((section) => ({
			id: section?.id,
			sectionProps: section ? { icon: section.icon, title: section.label } : undefined,
			items: nodesFor(rootsFor(indexed, section?.id), 0)
		}));
	});
</script>

<div
	bind:this={tree}
	role="tree"
	aria-label={label ?? 'Tree view'}
	aria-multiselectable={Array.isArray(selection) ? true : undefined}
	data-size={size}
	tabindex={visible.length ? -1 : 0}
	onkeydown={onKeydown}
>
	{#each groupedItems as group (group.id)}
		<TreeViewSection sectionProps={group.sectionProps} items={group.items} />
	{/each}
</div>

<style>
	[role='tree'] {
		--tree-height: 2.75rem;
		--tree-icon-size: 1.25rem;
		--tree-action-size: 2.25rem;
		display: grid;
		gap: 0.375rem;
		width: 100%;
		min-width: 0;
		color: var(--color-foreground);
		font: inherit;
		user-select: none;
	}
	[role='tree'][data-size='small'] {
		--tree-height: 2.5rem;
		--tree-icon-size: 1rem;
		--tree-action-size: 2rem;
		font-size: 0.875rem;
	}
	[role='tree'][data-size='large'] {
		--tree-height: 3.25rem;
		--tree-icon-size: 1.5rem;
		--tree-action-size: 2.5rem;
		font-size: 1.125rem;
	}
	[role='tree']:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (forced-colors: active) {
		[role='tree']:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
