<script module lang="ts">
	import type { BaseSize } from '../types.js';
	import type { TreeItemProps } from './tree-node.svelte';
	import type { TreeSectionProps } from './tree-branch.svelte';
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
	/* eslint-disable max-lines, func-style -- Focus and keyboard behavior stay together. */
	import { tick, untrack } from 'svelte';
	import TreeBranch, {
		childrenFor,
		indexTree,
		revealSelection,
		visibleItems
	} from './tree-branch.svelte';
	import type { TreeIndex, VisibleItem } from './tree-branch.svelte';

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
	<TreeBranch
		{indexed}
		{visible}
		{expanded}
		{initialExpanded}
		{selected}
		{activeId}
		onFocus={(id) => (focusId = id)}
		onSelect={select}
		onToggle={toggle}
		onDelete={onDelete ? deleteNode : undefined}
		{focus}
	/>
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
