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
		width: var(--tree-action-size);
		flex-shrink: 0;
		height: var(--tree-height);
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--tree-action-color, inherit);
		font: inherit;
		font-size: 16px;
		cursor: pointer;
		transition: none;
	}
	button:not(:disabled):hover {
		background: color-mix(in srgb, currentColor 8%, transparent);
	}
	button:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: -1px;
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
