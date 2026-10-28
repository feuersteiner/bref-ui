<script lang="ts">
	import ChevronButton from './chevron-button.svelte';
	import DeleteButton from './delete-button.svelte';
	import Content from './content.svelte';
	import RecursiveNode from './tree-node.svelte';
	import type { TreeNodeProps } from 'bref-ui/types';

	let {
		item,
		selection = $bindable(),
		defaultExpanded = false,
		glass = false,
		onDelete,
		indent = 0
	}: TreeNodeProps = $props();

	// svelte-ignore state_referenced_locally
	let expanded = $state(defaultExpanded);
	const childrenId = $props.id();

	const selected = $derived(
		Array.isArray(selection) ? selection.includes(item.id) : selection === item.id
	);
	const select = () => {
		selection = Array.isArray(selection)
			? selected
				? selection.filter((id) => id !== item.id)
				: [...selection, item.id]
			: item.id;
	};
</script>

<div
	data-selected={selected}
	data-disabled={item.disabled}
	style:padding-left={`calc(6px + ${indent} * 12px)`}
>
	{#if item.children?.length}
		<ChevronButton
			aria-label={`Children of ${item.label}`}
			aria-expanded={expanded}
			aria-controls={childrenId}
			disabled={item.disabled}
			onclick={() => (expanded = !expanded)}
		/>
	{:else}
		<span data-spacer aria-hidden="true"></span>
	{/if}
	<Content {item} aria-pressed={selected} onclick={select} />
	{#if onDelete}
		<DeleteButton
			aria-label={`Delete ${item.label}`}
			disabled={item.disabled}
			onclick={() => onDelete?.(item.id)}
		/>
	{/if}
</div>
{#if item.children?.length && expanded}
	<div
		id={childrenId}
		role="group"
		aria-label={`Children of ${item.label}`}
		data-children
		style:--tree-guide-left={`calc(14px + ${indent} * 12px)`}
	>
		{#each item.children as child (child.id)}
			<RecursiveNode
				indent={indent + 1}
				item={child}
				bind:selection
				{defaultExpanded}
				{onDelete}
				{glass}
			/>
		{/each}
	</div>
{/if}

<style>
	div[data-selected] {
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
		height: var(--tree-height);
		padding: 0 6px;
		border-radius: 2px;
		color: var(--color-foreground);
	}
	[data-spacer] {
		flex: 0 0 var(--tree-action-size);
	}
	[data-children] {
		position: relative;
	}
	[data-children]::before {
		content: '';
		position: absolute;
		inset-block: 0;
		left: var(--tree-guide-left);
		border-left: 1px solid #404040;
		pointer-events: none;
	}
	div[data-selected='true'] {
		background: #37373d;
	}
	div[data-selected='true']:focus-within {
		background: #04395e;
		color: #ffffff;
	}
	div[data-selected='false']:not([data-disabled='true']):hover {
		background: #2a2d2e;
	}
	div[data-disabled='true'] {
		color: var(--color-muted);
	}
	@media (forced-colors: active) {
		div[data-selected='true'] {
			background: Highlight;
			color: HighlightText;
		}
		div[data-disabled='true'] {
			color: GrayText;
		}
	}
</style>
