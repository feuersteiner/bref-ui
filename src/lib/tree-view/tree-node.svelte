<script lang="ts">
	/* eslint-disable max-lines -- Keep the node and its scoped interaction styles together. */
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import RecursiveNode from './tree-node.svelte';
	import type { TreeNodeProps } from './types.js';

	let {
		item,
		selection = $bindable(),
		defaultExpanded = false,
		onDelete
	}: TreeNodeProps = $props();

	let expanded = $derived(defaultExpanded);
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
>
	{#if item.children?.length}
		<button
			type="button"
			aria-label={`Children of ${item.label}`}
			aria-expanded={expanded}
			aria-controls={childrenId}
			onclick={() => (expanded = !expanded)}
		>
			<span data-chevron><Icon name="chevron_right" /></span>
		</button>
	{:else}
		<span data-spacer aria-hidden="true"></span>
	{/if}
	<button type="button" aria-pressed={selected} disabled={item.disabled} onclick={select}>
		{#if item.icon}<Icon {...item.icon} label={undefined} />{/if}
		<span>{item.label}</span>
	</button>
	{#if onDelete}
		<button
			type="button"
			aria-label={`Delete ${item.label}`}
			disabled={item.disabled}
			onclick={() => onDelete?.(item.id)}
		>
			<Icon name="close" />
		</button>
	{/if}
</div>
{#if item.children?.length}
	<ul id={childrenId} hidden={!expanded}>
		{#each item.children as child (child.id)}
			<li><RecursiveNode item={child} bind:selection {defaultExpanded} {onDelete} /></li>
		{/each}
	</ul>
{/if}

<style>
	* {
		transition: all 150ms;
	}
	li {
		min-width: 0;
	}
	div {
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		min-height: var(--tree-height);
		padding: 0.125rem 0.25rem;
		border: 1px solid transparent;
		border-radius: 999px;
		overflow-wrap: anywhere;
	}
	[data-spacer] {
		flex: 0 0 var(--tree-action-size);
	}
	[data-chevron] {
		display: inline-flex;
		font-size: 1.25em;
	}
	button[aria-expanded='true'] [data-chevron] {
		transform: rotate(90deg);
	}
	ul {
		display: grid;
		gap: 0.375rem;
		margin: 0.375rem 0 0;
		padding: 0;
		padding-inline-start: 1.25rem;
		list-style: none;
	}
	ul[hidden] {
		display: none;
	}
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-width: var(--tree-action-size);
		min-height: var(--tree-action-size);
		padding: 0.25rem 0.5rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
	button[aria-pressed] {
		flex: 1;
		min-width: 0;
		justify-content: start;
		text-align: start;
		outline: none;
	}
	button[aria-pressed]::before {
		position: absolute;
		inset: 0;
		content: '';
	}
	button:not([aria-pressed]) {
		position: relative;
		z-index: 1;
	}
	div[data-selected='true'] {
		border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
		background: color-mix(in srgb, var(--color-primary) 16%, transparent);
		color: var(--color-primary);
	}
	div:not([data-selected='true'], [data-disabled='true']):hover,
	button:not([aria-pressed], :disabled):hover {
		background: color-mix(in srgb, var(--color-primary) 12%, transparent);
	}
	div:has(> button[aria-pressed]:focus-visible),
	button:not([aria-pressed]):focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
	button:disabled {
		color: var(--color-muted);
		cursor: default;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		div[data-selected='true'] {
			border-color: Highlight;
			color: Highlight;
		}
		button:disabled {
			color: GrayText;
		}
		div:has(> button[aria-pressed]:focus-visible),
		button:not([aria-pressed]):focus-visible {
			outline-color: Highlight;
		}
	}
</style>
