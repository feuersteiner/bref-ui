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
		flex: 0 0 var(--tree-action-size);
		width: var(--tree-action-size);
		height: var(--tree-action-size);
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--tree-action-color, inherit);
		font: inherit;
		cursor: pointer;
	}
	span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		font-size: 1.125em;
		line-height: 1;
		transform-origin: center;
		transition:
			transform 150ms ease,
			background-color 150ms ease;
	}
	button[aria-expanded='true'] span {
		transform: rotate(90deg);
	}
	button:not(:disabled):hover span {
		background: color-mix(in srgb, currentColor 8%, transparent);
	}
	button:focus-visible {
		outline: none;
	}
	button:focus-visible span {
		outline: 2px solid var(--color-primary);
		outline-offset: 1px;
	}
	@media (prefers-reduced-motion: reduce) {
		button,
		span {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button:focus-visible span {
			outline-color: Highlight;
		}
	}
</style>
