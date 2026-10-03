<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import RecursiveNode from './tree-node.svelte';
	import TreeRow from './tree-row.svelte';
	import type { TreeNodeProps } from './types.js';

	let { node, actions }: TreeNodeProps = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	role="treeitem"
	use:actions.trackFocus
	in:fly|global={{
		y: prefersReducedMotion.current ? 0 : -6,
		duration: prefersReducedMotion.current ? 0 : 150
	}}
	data-tree-id={node.id}
	aria-label={node.label}
	aria-level={node.level + 1}
	aria-posinset={node.position}
	aria-setsize={node.siblingCount}
	aria-expanded={node.items.length ? node.open : undefined}
	aria-selected={node.disabled ? undefined : node.selected}
	aria-disabled={node.disabled && !node.items.length ? true : undefined}
	title={node.disabled && node.items.length ? 'Unavailable for selection' : undefined}
	data-disabled={node.disabled || undefined}
	style:--tree-level={node.level}
	tabindex={node.tabIndex}
	onfocus={(event) => {
		if (event.target === event.currentTarget) actions.focus(node.id);
	}}
	onclick={(event) => {
		if (
			event.target instanceof Element &&
			event.target.closest('[role="treeitem"]') === event.currentTarget &&
			!event.target.closest('button')
		)
			actions.select(node.id);
	}}
>
	<TreeRow {node} {actions} />
	{#if node.open && node.items.length}
		<div role="group">
			{#each node.items as child (child.id)}
				<RecursiveNode node={child} {actions} />
			{/each}
		</div>
	{/if}
</div>

<style>
	div {
		display: grid;
		gap: 0.375rem;
		min-width: 0;
	}
	[role='treeitem'] {
		--tree-focus: none;
		--tree-tint: 0%;
		--tree-border: transparent;
		--tree-shadow: none;
		--tree-filter: none;
		--tree-content: var(--color-foreground);
		--tree-base-background: transparent;
		--tree-opacity: 100%;
		width: 100%;
		outline: none;
		cursor: pointer;
	}
	[role='treeitem'][aria-selected='true'] {
		--tree-tint: 16%;
		--tree-border: color-mix(in srgb, var(--color-primary) 30%, transparent);
		--tree-base-background: var(--color-background);
		--tree-opacity: 85%;
		--tree-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--color-foreground) 16%, transparent),
			0 2px 6px color-mix(in srgb, var(--color-foreground) 8%, transparent);
		--tree-filter: blur(0.5rem) saturate(120%);
		--tree-content: var(--color-primary);
	}
	[role='treeitem'][data-disabled] {
		--tree-content: var(--color-muted);
	}
	[role='treeitem']:focus-visible {
		--tree-focus: 2px solid var(--color-primary);
	}
	@media (forced-colors: active) {
		[role='treeitem'][aria-selected='true'] {
			--tree-focus: 1px solid Highlight;
			--tree-border: Highlight;
			--tree-base-background: Canvas;
			--tree-opacity: 100%;
			--tree-tint: 0%;
			--tree-shadow: none;
			--tree-filter: none;
			--tree-content: Highlight;
		}
		[role='treeitem']:focus-visible {
			--tree-focus: 2px solid Highlight;
		}
		[role='treeitem'][data-disabled] {
			--tree-content: GrayText;
		}
	}
</style>
