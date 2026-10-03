<script lang="ts">
	import TreeViewSection from './tree-view-section.svelte';
	import { createTree } from './tree.svelte.js';
	import { treeKeyboard } from './navigation.js';
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

	const tree = createTree(
		() => ({ items, sections, selection, defaultExpanded, onDelete }),
		(value) => (selection = value)
	);
	const onKeydown = treeKeyboard(tree);
</script>

<div
	bind:this={tree.element}
	role="tree"
	aria-label={label}
	aria-multiselectable={Array.isArray(selection) ? true : undefined}
	data-size={size}
	tabindex={tree.visible.length ? -1 : 0}
	onkeydown={onKeydown}
>
	{#each tree.groups as group (group.section?.id)}
		<TreeViewSection {...group} actions={tree.actions} />
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
