<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import TreeNode from './tree-node.svelte';
	import type { TreeViewProps } from './types.js';

	let {
		items,
		sections = [],
		label = 'Tree view',
		size = 'medium',
		selection = $bindable(),
		defaultExpanded = false,
		onDelete
	}: TreeViewProps = $props();
</script>

{#snippet nodes(items: TreeViewProps['items'])}
	<div data-nodes>
		{#each items as item (item.id)}
			<TreeNode {item} bind:selection {defaultExpanded} {onDelete} />
		{/each}
	</div>
{/snippet}

<div role="group" aria-label={label} data-size={size}>
	{@render nodes(items)}
	{#each sections as section (section.id)}
		<section aria-label={section.label}>
			<header>
				{#if section.icon}<Icon {...section.icon} label={undefined} />{/if}
				{section.label}
			</header>
			{@render nodes(section.items)}
		</section>
	{/each}
</div>

<style>
	div {
		--tree-height: 2.75rem;
		--tree-action-size: 2.25rem;
		display: grid;
		gap: 0.375rem;
		min-width: 0;
		color: var(--color-foreground);
		font: inherit;
	}
	div[data-size='small'] {
		--tree-height: 2.5rem;
		--tree-action-size: 2rem;
		font-size: 0.875rem;
	}
	div[data-size='large'] {
		--tree-height: 3.25rem;
		--tree-action-size: 2.5rem;
		font-size: 1.125rem;
	}
	header {
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
	div[data-nodes] {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
