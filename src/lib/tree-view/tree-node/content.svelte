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
	* {
		transition: all 150ms;
	}
	button {
		display: inline-flex;
		align-items: center;
		justify-content: start;
		flex: 1;
		gap: 0.5rem;
		min-width: 0;
		min-height: var(--tree-action-size);
		padding: 0.25rem 0.5rem;
		border: 0;
		border-radius: 999px;
		outline: none;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: start;
		cursor: pointer;
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
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
		}
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
