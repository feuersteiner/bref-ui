<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { TreeNodeProps } from './types.js';

	let { node, actions }: TreeNodeProps = $props();
</script>

<span data-row data-selected={node.selected} data-disabled={node.disabled || undefined}>
	{#if node.items.length}
		<button
			type="button"
			aria-label={`${node.open ? 'Collapse' : 'Expand'} ${node.label}`}
			tabindex="-1"
			onclick={() => actions.toggle(node.id)}
		>
			<span data-chevron data-open={node.open}><Icon name="chevron_right" /></span>
		</button>
	{:else}<span data-spacer aria-hidden="true"></span>{/if}
	<span data-icon>
		{#if node.icon}<Icon {...node.icon} label={undefined} />{/if}
	</span>
	<span data-label>{node.label}</span>
	{#if actions.remove}
		<button
			type="button"
			aria-label={`Delete ${node.label}`}
			disabled={node.disabled}
			tabindex="-1"
			onclick={() => actions.remove?.(node.id)}
		>
			<Icon name="close" />
		</button>
	{/if}
</span>

<style>
	[data-row] {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		min-height: var(--tree-height);
		padding: 0.25rem 0.5rem;
		padding-inline-start: calc(0.5rem + var(--tree-level) * 1.25rem);
		border: 1px solid var(--tree-border);
		border-radius: 999px;
		background: color-mix(
			in srgb,
			color-mix(in srgb, var(--color-primary) var(--tree-tint), var(--tree-base-background))
				var(--tree-opacity),
			transparent
		);
		box-shadow: var(--tree-shadow);
		-webkit-backdrop-filter: var(--tree-filter);
		backdrop-filter: var(--tree-filter);
		color: var(--tree-content);
		outline: var(--tree-focus);
		outline-offset: -2px;
		transition:
			background 150ms,
			border-color 150ms;
	}
	[data-row]:not([data-disabled]):hover {
		--tree-tint: 8%;
	}
	[data-row][data-selected='true']:hover {
		--tree-tint: 22%;
		border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
	}
	[data-row]:not([data-disabled]):active {
		--tree-tint: 26%;
	}
	[data-row][data-selected='true']:active {
		--tree-tint: 28%;
	}
	[data-spacer] {
		flex: 0 0 var(--tree-action-size);
	}
	[data-icon] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 var(--tree-icon-size);
		font-size: var(--tree-icon-size);
	}
	[data-chevron] {
		display: inline-flex;
		transition: transform 150ms;
	}
	[data-chevron][data-open='true'] {
		transform: rotate(90deg);
	}
	[data-label] {
		flex: 1;
		min-width: 0;
		overflow-wrap: anywhere;
	}
	button {
		display: inline-grid;
		place-items: center;
		flex: 0 0 var(--tree-action-size);
		width: var(--tree-action-size);
		height: var(--tree-action-size);
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: inherit;
		font-size: var(--tree-icon-size);
		cursor: pointer;
		transition: background 150ms;
	}
	button:not(:disabled):hover {
		background: color-mix(in srgb, var(--color-primary) 12%, transparent);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
	}
	button:disabled {
		cursor: default;
		opacity: 0.5;
	}
	@media (prefers-reduced-motion: reduce) {
		[data-row],
		[data-chevron],
		button {
			transition: none;
		}
	}
</style>
