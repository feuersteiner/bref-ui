<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Icon from '../../icon/icon.svelte';

	let attributes: HTMLButtonAttributes = $props();
</script>

<button {...attributes} type="button"><Icon name="close" /></button>

<style>
	button {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--tree-action-size);
		min-height: var(--tree-action-size);
		padding: 0;
		border: 0;
		border-radius: 0.375rem;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: 1.125em;
		cursor: pointer;
		transition: background-color 150ms ease;
	}
	button:not(:disabled):hover {
		background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
	button:disabled {
		color: var(--color-muted);
		cursor: default;
	}
	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button:disabled {
			color: GrayText;
		}
		button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
