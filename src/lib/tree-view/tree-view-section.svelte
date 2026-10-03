<script module lang="ts">
	import type { TreeNodeProps } from './tree-node.svelte';
	export interface TreeViewSectionProps {
		sectionProps?: { icon?: TreeNodeProps['icon']; title: string };
		items: TreeNodeProps[];
	}
</script>

<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import TreeNode from './tree-node.svelte';
	let { sectionProps, items }: TreeViewSectionProps = $props();
</script>

<div role="group" aria-label={sectionProps?.title} data-section-group>
	{#if sectionProps}
		<div data-section role="presentation">
			{#if sectionProps.icon}<Icon {...sectionProps.icon} label={undefined} />{/if}
			<span>{sectionProps.title}</span>
		</div>
	{/if}
	{#each items as item (item.id)}
		<TreeNode {...item} />
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
