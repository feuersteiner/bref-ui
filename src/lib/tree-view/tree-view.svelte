<script lang="ts">
	/* eslint-disable max-lines, func-style -- Tree behavior and scoped styles share one component. */
	import { tick, untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import { revealSelection } from './selection.js';
	import type { TreeItemProps, TreeViewProps } from './types.js';
	import {
		childrenFor,
		indexTree,
		keyboardTarget,
		nextFocusAfterChange,
		rootsFor,
		typeaheadMatch,
		visibleItems
	} from './state.js';

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

{#snippet renderNode(node: TreeItemProps, level: number)}
	{@const children = childrenFor(indexed, node.id)}
	{@const siblings =
		node.parentId === undefined
			? rootsFor(indexed, node.sectionId)
			: childrenFor(indexed, node.parentId)}
	{@const open = expanded[node.id] ?? initialExpanded}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="treeitem"
		in:fly|global={{
			y: prefersReducedMotion.current ? 0 : -6,
			duration: prefersReducedMotion.current ? 0 : 150
		}}
		data-tree-id={node.id}
		aria-label={node.label}
		aria-level={level + 1}
		style:--tree-level={level}
		aria-posinset={siblings.indexOf(node) + 1}
		aria-setsize={siblings.length}
		aria-expanded={children.length ? open : undefined}
		aria-selected={node.disabled ? undefined : selected.includes(node.id)}
		aria-disabled={node.disabled && !children.length ? true : undefined}
		title={node.disabled && children.length ? 'Unavailable for selection' : undefined}
		data-disabled={node.disabled ? 'true' : undefined}
		tabindex={activeId === node.id ? 0 : -1}
		onfocus={(event) => {
			if (event.target === event.currentTarget) focusId = node.id;
		}}
		onclick={(event) => {
			if (
				event.target instanceof Element &&
				event.target.closest('[role="treeitem"]') === event.currentTarget &&
				!event.target.closest('button, [data-disclosure]')
			) {
				select(node.id);
				focus(node.id);
			}
		}}
	>
		<span data-row>
			{#if children.length}
				<button
					type="button"
					data-disclosure
					aria-label={`${open ? 'Collapse' : 'Expand'} ${node.label}`}
					tabindex="-1"
					onfocus={() => (focusId = node.id)}
					onclick={(event) => {
						event.stopPropagation();
						toggle(node.id);
						focus(node.id);
					}}
				>
					<span data-chevron data-open={open}><Icon name="chevron_right" /></span>
				</button>
			{:else}<span data-spacer aria-hidden="true"></span>{/if}
			<span data-icon>
				{#if node.icon}<Icon {...node.icon} label={undefined} />{/if}
			</span>
			<span data-label>{node.label}</span>
			{#if onDelete}
				<button
					type="button"
					aria-label={`Delete ${node.label}`}
					disabled={node.disabled}
					tabindex="-1"
					onfocus={() => (focusId = node.id)}
					onclick={(event) => {
						event.stopPropagation();
						deleteNode(node.id);
					}}
				>
					<Icon name="close" />
				</button>
			{/if}
		</span>
	</div>
{/snippet}

<div
	bind:this={tree}
	role="tree"
	aria-label={label ?? 'Tree view'}
	aria-multiselectable={Array.isArray(selection) ? true : undefined}
	data-size={size}
	tabindex={visible.length ? -1 : 0}
	onkeydown={onKeydown}
>
	{#each indexed.sections as section (section?.id ?? '')}
		{#if section}
			<div role="group" aria-label={section.label} data-section-group>
				<div data-section role="presentation">
					{#if section.icon}<Icon {...section.icon} label={undefined} />{/if}
					<span>{section.label}</span>
				</div>
				{#each visible.filter(({ item }) => item.sectionId === section.id) as entry (entry.item.id)}
					{@render renderNode(entry.item, entry.level - 1)}
				{/each}
			</div>
		{:else}
			{#each visible.filter(({ item }) => item.sectionId === undefined) as entry (entry.item.id)}
				{@render renderNode(entry.item, entry.level - 1)}
			{/each}
		{/if}
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
	[data-section-group] {
		display: grid;
		gap: 0.375rem;
		min-width: 0;
	}
	[role='treeitem'] {
		width: 100%;
		min-width: 0;
		border-radius: 999px;
		outline: none;
		cursor: pointer;
	}
	[data-row] {
		--tree-tint: 0%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		min-height: var(--tree-height);
		padding: 0.25rem 0.5rem;
		padding-inline-start: calc(0.5rem + var(--tree-level) * 1.25rem);
		border: 1px solid transparent;
		border-radius: inherit;
		background: color-mix(in srgb, var(--color-primary) var(--tree-tint), transparent);
		transition: all 150ms;
	}
	[role='treeitem']:not([data-disabled='true']):hover > [data-row] {
		--tree-tint: 8%;
	}
	[role='treeitem'][aria-selected='true'] > [data-row] {
		--tree-tint: 16%;
		background: color-mix(
			in srgb,
			color-mix(in srgb, var(--color-primary) var(--tree-tint), var(--color-background)) 85%,
			transparent
		);
		border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--color-foreground) 16%, transparent),
			0 2px 6px color-mix(in srgb, var(--color-foreground) 8%, transparent);
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
		color: var(--color-primary);
	}
	[role='treeitem'][aria-selected='true']:hover > [data-row] {
		--tree-tint: 22%;
		border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
	}
	[role='treeitem']:not([data-disabled='true']):active > [data-row] {
		--tree-tint: 26%;
	}
	[role='treeitem'][aria-selected='true']:active > [data-row] {
		--tree-tint: 28%;
	}
	[role='treeitem'][data-disabled='true'] > [data-row] {
		color: var(--color-muted);
	}
	[role='treeitem']:focus-visible > [data-row] {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
	[role='tree']:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	[data-spacer] {
		flex: 0 0 var(--tree-action-size);
	}
	[data-icon] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 var(--tree-icon-size);
		font-size: var(--tree-icon-size);
	}
	[data-chevron] {
		display: inline-flex;
		transition: all 150ms;
	}
	[data-chevron][data-open='true'] {
		transform: rotate(90deg);
	}
	[data-label] {
		flex: 1;
		min-width: 0;
		overflow-wrap: anywhere;
	}
	[data-section] {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 0.5rem 0.25rem;
		color: var(--color-muted);
		font-size: 0.8em;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	button {
		display: inline-grid;
		place-items: center;
		flex: 0 0 var(--tree-action-size);
		width: var(--tree-action-size);
		height: var(--tree-action-size);
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: inherit;
		font-size: var(--tree-icon-size);
		cursor: pointer;
		transition: all 150ms;
	}
	button:not(:disabled):hover {
		background: color-mix(in srgb, var(--color-primary) 12%, transparent);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
	}
	button:disabled {
		cursor: default;
		opacity: 0.5;
	}
	@media (prefers-reduced-motion: reduce) {
		[data-row],
		[data-chevron],
		button {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		[role='treeitem'][aria-selected='true'] > [data-row] {
			outline: 1px solid Highlight;
			border-color: Highlight;
			background: Canvas;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
			color: Highlight;
		}
		[role='treeitem']:focus-visible > [data-row],
		[role='tree']:focus-visible {
			outline-color: Highlight;
		}
		[role='treeitem'][data-disabled='true'] > [data-row] {
			color: GrayText;
		}
	}
</style>
