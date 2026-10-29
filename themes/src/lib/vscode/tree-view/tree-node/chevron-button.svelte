<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Icon from '../../icon/icon.svelte';

	let attributes: HTMLButtonAttributes = $props();
</script>

<button {...attributes} type="button">
	<span><Icon name="chevron_right" /></span>
</button>

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
		cursor: pointer;
		transition: none;
	}
	span {
		display: inline-flex;
		font-size: 16px;
		transition: none;
	}
	button[aria-expanded='true'] span {
		transform: rotate(90deg);
	}
	button:not(:disabled):hover {
		background: color-mix(in srgb, currentColor 8%, transparent);
	}
	button:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: -1px;
	}
	@media (prefers-reduced-motion: reduce) {
		button,
		span {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
