<script lang="ts">
	/* eslint-disable max-lines, func-style -- Tree behavior and its scoped visual recipe are kept together. */
	import { tick } from 'svelte';
	import type { TreeItem, TreeViewProps } from './types.js';
	import {
		indexTree,
		keyboardTarget,
		nextFocusAfterChange,
		typeaheadMatch,
		validIds,
		visibleItems
	} from './state.js';

	let {
		items,
		size = 'medium',
		selection = 'single',
		selectedIds = $bindable([]),
		expandedIds = $bindable([]),
		item,
		ref = $bindable(),
		onkeydown: nativeOnKeydown,
		...attributes
	}: TreeViewProps = $props();

	const indexed = $derived(indexTree(items));
	const selected = $derived(
		validIds(selectedIds, indexed)
			.filter((id) => !indexed.get(id)?.disabled)
			.slice(0, selection === 'single' ? 1 : undefined)
	);
	const expanded = $derived(
		validIds(expandedIds, indexed).filter((id) => Boolean(indexed.get(id)?.children?.length))
	);
	const visible = $derived(visibleItems(items, expanded));
	let focusId = $state<string>();
	const activeId = $derived(
		visible.some(({ item }) => item.id === focusId)
			? focusId
			: (visible.find(({ item }) => selected.includes(item.id))?.item.id ?? visible[0]?.item.id)
	);
	let previousVisible: ReturnType<typeof visibleItems> = [];
	let restoreFocus = false;
	let typeahead = '';
	let typeaheadAt = 0;

	$effect(() => {
		if (
			selectedIds.length !== selected.length ||
			selectedIds.some((id, index) => id !== selected[index])
		)
			selectedIds = selected;
		if (
			expandedIds.length !== expanded.length ||
			expandedIds.some((id, index) => id !== expanded[index])
		)
			expandedIds = expanded;
	});

	$effect.pre(() => {
		const current = visible;
		restoreFocus = Boolean(
			focusId &&
			!current.some(({ item }) => item.id === focusId) &&
			ref?.contains(document.activeElement)
		);
	});

	$effect(() => {
		const current = visible;
		if (focusId && !current.some(({ item }) => item.id === focusId)) {
			focusId = nextFocusAfterChange(previousVisible, current, focusId, indexed.has(focusId));
			if (restoreFocus) void tick().then(() => focusCurrent());
		} else if (!current.length && ref === document.activeElement) focusId = undefined;
		previousVisible = current;
	});

	function elementFor(id: string): HTMLElement | undefined {
		return Array.from(ref?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? []).find(
			(element) => element.dataset.treeId === id
		);
	}

	function focusCurrent() {
		if (activeId) elementFor(activeId)?.focus();
		else ref?.focus();
	}

	function focus(id: string) {
		focusId = id;
		void tick().then(focusCurrent);
	}

	function toggleExpanded(id: string) {
		if (!indexed.get(id)?.children?.length) return;
		expandedIds = expanded.includes(id)
			? expanded.filter((value) => value !== id)
			: [...expanded, id];
	}

	function select(id: string) {
		if (indexed.get(id)?.disabled) return;
		selectedIds =
			selection === 'multiple'
				? selected.includes(id)
					? selected.filter((value) => value !== id)
					: [...selected, id]
				: [id];
	}

	function onKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		nativeOnKeydown?.(event);
		if (event.defaultPrevented) return;
		if (
			event.target !== ref &&
			!(event.target instanceof HTMLElement && event.target.getAttribute('role') === 'treeitem')
		)
			return;
		const id = event.target === ref ? activeId : (event.target as HTMLElement).dataset.treeId;
		if (!id) return;
		let next: string | undefined;
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
			case 'Home':
			case 'End':
			case 'ArrowRight':
			case 'ArrowLeft': {
				const target = keyboardTarget(visible, expanded, id, event.key);
				if (target.toggleId) toggleExpanded(target.toggleId);
				next = target.focusId;
				break;
			}
			case 'Enter':
			case ' ':
				select(id);
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
		if (next) focus(next);
	}
</script>

{#snippet renderNode(node: TreeItem, level: number)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="treeitem"
		data-tree-id={node.id}
		aria-label={node.label}
		aria-level={level}
		aria-expanded={node.children?.length ? expanded.includes(node.id) : undefined}
		aria-selected={selected.includes(node.id)}
		aria-disabled={node.disabled ? true : false}
		tabindex={activeId === node.id ? 0 : -1}
		onfocus={() => (focusId = node.id)}
		onclick={(event) => {
			if (
				event.target instanceof Element &&
				event.target.closest('[role="treeitem"]') === event.currentTarget &&
				!event.target.closest('[data-disclosure]')
			) {
				select(node.id);
				focus(node.id);
			}
		}}
	>
		<span data-row>
			{#if node.children?.length}
				<span
					data-disclosure
					aria-hidden="true"
					onclick={(event) => {
						event.stopPropagation();
						toggleExpanded(node.id);
					}}
				>
					{expanded.includes(node.id) ? '▾' : '▸'}
				</span>
			{:else}<span data-spacer aria-hidden="true"></span>{/if}
			<span data-label aria-hidden={item ? 'true' : undefined}>{node.label}</span>
			{#if item}<span aria-hidden="true">{@render item(node)}</span>{/if}
		</span>
		{#if node.children?.length && expanded.includes(node.id)}
			<div role="group">
				{#each node.children as child (child.id)}{@render renderNode(child, level + 1)}{/each}
			</div>
		{/if}
	</div>
{/snippet}

<div
	{...attributes}
	bind:this={ref}
	role="tree"
	aria-multiselectable={selection === 'multiple' ? true : undefined}
	data-size={size}
	tabindex={visible.length ? -1 : 0}
	onkeydown={onKeydown}
>
	{#each items as node (node.id)}{@render renderNode(node, 1)}{/each}
</div>

<style>
	[role='tree'] {
		--tree-height: 2.75rem;
		color: var(--color-foreground, #28231f);
		font: inherit;
		min-width: 0;
	}
	[role='tree'][data-size='small'] {
		--tree-height: 2.5rem;
	}
	[role='tree'][data-size='large'] {
		--tree-height: 3.25rem;
	}
	[role='group'] {
		padding-inline-start: 1.25rem;
	}
	[role='treeitem'] {
		border-radius: 0.4rem;
		outline: none;
		cursor: default;
	}
	[data-row] {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		min-height: var(--tree-height);
		padding: 0.25rem 0.5rem;
		border-radius: inherit;
	}
	[role='treeitem'][aria-selected='true'] > [data-row] {
		background: color-mix(in srgb, var(--color-primary, #0d9488) 18%, transparent);
	}
	[role='treeitem']:hover > [data-row] {
		background: color-mix(in srgb, var(--color-primary, #0d9488) 12%, transparent);
	}
	[role='treeitem'][aria-disabled='true'] > [data-row] {
		color: var(--color-muted, #686868);
	}
	[role='treeitem']:focus-visible > [data-row] {
		outline: 2px solid var(--color-primary, #0d9488);
		outline-offset: -2px;
	}
	[role='tree']:focus-visible {
		outline: 2px solid var(--color-primary, #0d9488);
		outline-offset: 2px;
	}
	[data-disclosure],
	[data-spacer] {
		display: inline-grid;
		place-items: center;
		flex: 0 0 2.5rem;
		min-height: var(--tree-height);
	}
	[data-disclosure] {
		cursor: pointer;
	}
	[data-label] {
		overflow-wrap: anywhere;
	}
	@media (forced-colors: active) {
		[role='treeitem'][aria-selected='true'] > [data-row] {
			border: 1px solid Highlight;
		}
		[role='treeitem']:focus-visible > [data-row],
		[role='tree']:focus-visible {
			outline-color: Highlight;
		}
		[role='treeitem'][aria-disabled='true'] > [data-row] {
			color: GrayText;
		}
	}
</style>
