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
		--tree-height: 22px;
		--tree-action-size: 16px;
		display: grid;
		gap: 0;
		min-width: 0;
		color: var(--color-foreground);
		font: inherit;
		font-size: 13px;
		line-height: 1.25;
	}
	div[data-size='small'] {
		--tree-height: 20px;
		font-size: 12px;
	}
	div[data-size='large'] {
		--tree-height: 28px;
		--tree-action-size: 16px;
		font-size: 13px;
	}
	div[data-nodes] {
		display: flex;
		flex-direction: column;
		gap: 0;
		min-width: 0;
	}
	@media (pointer: coarse) {
		div[role='group'] {
			--tree-height: 2.75rem;
			--tree-action-size: 2.75rem;
		}
	}
</style>
