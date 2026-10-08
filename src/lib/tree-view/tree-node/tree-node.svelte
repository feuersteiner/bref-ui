<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import ChevronButton from './chevron-button.svelte';
	import DeleteButton from './delete-button.svelte';
	import Content from './content.svelte';
	import RecursiveNode from './tree-node.svelte';
	import type { TreeNodeProps } from '../types.js';

	let {
		item,
		selection = $bindable(),
		defaultExpanded = false,
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
	in:fly|global={{ y: -4, duration: prefersReducedMotion.current ? 0 : 150 }}
	data-selected={selected}
	data-disabled={item.disabled}
	style:padding-left={`calc(0.25rem + ${indent} * var(--tree-action-size))`}
>
	{#if item.children?.length}
		<ChevronButton
			aria-label={`Children of ${item.label}`}
			aria-expanded={expanded}
			aria-controls={childrenId}
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
{#if item.children?.length}
	<div role="group" id={childrenId} hidden={!expanded}>
		{#each item.children as child (child.id)}
			<RecursiveNode indent={indent + 1} item={child} bind:selection {defaultExpanded} {onDelete} />
		{/each}
	</div>
{/if}

<style>
	div[data-selected] {
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		min-height: var(--tree-height);
		padding: 0.125rem 0.25rem;
		border-radius: 0.375rem;
		overflow-wrap: anywhere;
		transition: background-color 150ms ease;
	}
	[data-spacer] {
		flex: 0 0 var(--tree-action-size);
	}
	div[role='group'] {
		display: contents;
	}
	div[hidden] {
		display: none;
	}
	div[data-selected='true'] {
		background: color-mix(in srgb, var(--color-primary) 10%, var(--color-background));
		color: var(--color-foreground);
	}
	div[data-selected='false']:not([data-disabled='true']):hover {
		background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		div[data-selected] {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		div[data-selected='true'] {
			outline: 1px solid Highlight;
			outline-offset: -1px;
		}
	}
</style>
