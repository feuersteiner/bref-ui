<script lang="ts">
	import Icon from '../../icon/icon.svelte';
	import type { TreeNodeContentProps } from '../types.js';

	let { item, ...attributes }: TreeNodeContentProps = $props();
</script>

<button {...attributes} type="button" disabled={item.disabled}>
	{#if item.icon}<Icon {...item.icon} label={undefined} />{/if}
	<span>{item.label}</span>
</button>

<style>
	button {
		display: grid;
		grid-template-columns: 1em minmax(0, 1fr);
		align-items: center;
		justify-content: start;
		flex: 1;
		gap: 0.5rem;
		min-width: 0;
		min-height: var(--tree-action-size);
		padding: 0.125rem 0.375rem;
		border: 0;
		border-radius: 0.375rem;
		outline: none;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: start;
		cursor: pointer;
	}
	span {
		grid-column: 2;
		min-width: 0;
	}
	button::before {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		content: '';
	}
	button:focus-visible::before {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
	button:disabled {
		color: var(--color-muted);
		cursor: default;
	}
	@media (forced-colors: active) {
		button:disabled {
			color: GrayText;
		}
		button:focus-visible::before {
			outline-color: Highlight;
		}
	}
</style>
