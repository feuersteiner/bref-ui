<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import RecursiveNode from './tree-node.svelte';
	import type { TreeNodeProps } from './types.js';

	let {
		item,
		selection = $bindable(),
		defaultExpanded = false,
		onDelete
	}: TreeNodeProps = $props();

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

<li>
	<div>
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
		<details open={defaultExpanded}>
			<summary aria-label={`Children of ${item.label}`}></summary>
			<ul>
				{#each item.children as child (child.id)}
					<RecursiveNode item={child} bind:selection {defaultExpanded} {onDelete} />
				{/each}
			</ul>
		</details>
	{/if}
</li>

<style>
	li {
		position: relative;
		min-width: 0;
	}
	div {
		display: flex;
		gap: 0.25rem;
		padding-inline-start: var(--tree-action-size);
	}
	summary {
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: 0;
		width: var(--tree-action-size);
		line-height: var(--tree-height);
		border-radius: 999px;
		list-style-position: inside;
		text-align: center;
		cursor: pointer;
	}
	ul {
		display: grid;
		gap: 0.375rem;
		margin: 0.375rem 0 0;
		padding: 0;
		padding-inline-start: 1.25rem;
		list-style: none;
	}
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-width: var(--tree-action-size);
		min-height: var(--tree-height);
		padding: 0.25rem 0.5rem;
		border: 1px solid transparent;
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
	}
	span {
		overflow-wrap: anywhere;
	}
	button[aria-pressed='true'] {
		border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
		background: color-mix(in srgb, var(--color-primary) 16%, transparent);
		color: var(--color-primary);
	}
	button:not(:disabled):hover,
	summary:hover {
		background: color-mix(in srgb, var(--color-primary) 12%, transparent);
	}
	button:focus-visible,
	summary:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
	button:disabled {
		color: var(--color-muted);
		cursor: default;
	}
	@media (forced-colors: active) {
		button[aria-pressed='true'] {
			border-color: Highlight;
			color: Highlight;
		}
		button:disabled {
			color: GrayText;
		}
		button:focus-visible,
		summary:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
