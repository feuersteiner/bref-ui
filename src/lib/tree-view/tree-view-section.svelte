<script lang="ts">
	import type { TreeViewSectionProps } from './types.js';
	import Icon from '../icon/icon.svelte';
	import TreeNode from './tree-node.svelte';
	let { section, items, actions }: TreeViewSectionProps = $props();
</script>

<div role="group" aria-label={section?.label} data-section-group>
	{#if section}
		<div data-section role="presentation">
			{#if section.icon}<Icon {...section.icon} label={undefined} />{/if}
			<span>{section.label}</span>
		</div>
	{/if}
	{#each items as item (item.id)}
		<TreeNode node={item} {actions} />
	{/each}
</div>

<style>
	[data-section-group] {
		display: grid;
		gap: 0.375rem;
		min-width: 0;
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
</style>
