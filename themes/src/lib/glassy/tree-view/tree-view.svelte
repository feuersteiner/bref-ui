<script lang="ts">
	import TreeNode from './tree-node/tree-node.svelte';
	import TreeViewSection from './tree-view-section.svelte';
	import type { TreeViewProps } from 'bref-ui/types';

	let {
		items,
		sections = [],
		label = 'Tree view',
		size = 'medium',
		glass = false,
		selection = $bindable(),
		defaultExpanded = false,
		onDelete,
		node
	}: TreeViewProps = $props();
</script>

{#snippet nodes(items: TreeViewProps['items'])}
	<div data-nodes>
		{#each items as item (item.id)}
			{#if node}
				{@render node(item)}
			{:else}
				<TreeNode {item} bind:selection {defaultExpanded} {onDelete} {glass} />
			{/if}
		{/each}
	</div>
{/snippet}

<div role="group" aria-label={label} data-size={size}>
	{@render nodes(items)}
	{#each sections as section (section.id)}
		<section aria-label={section.label}>
			<TreeViewSection {...section} />
			{@render nodes(section.items)}
		</section>
	{/each}
</div>

<style>
	div[role='group'] {
		--tree-height: 2rem;
		--tree-action-size: 1.5rem;
		display: grid;
		gap: 0.375rem;
		min-width: 0;
		color: var(--color-foreground);
		font: inherit;
		line-height: 1.25;
	}
	div[data-size='small'] {
		--tree-height: 1.75rem;
		font-size: 0.875rem;
	}
	div[data-size='large'] {
		--tree-height: 2.5rem;
		--tree-action-size: 2rem;
		font-size: 1.125rem;
	}
	div[data-nodes] {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}
	@media (pointer: coarse) {
		div[role='group'] {
			--tree-height: 2.75rem;
			--tree-action-size: 2.75rem;
		}
	}

	:focus-visible:not(input):not(textarea) {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::after {
			transition: none;
			animation: none;
		}
	}
	@media (forced-colors: active) {
		:focus-visible:not(input):not(textarea) {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none;
			transition: none;
		}
	}
</style>
