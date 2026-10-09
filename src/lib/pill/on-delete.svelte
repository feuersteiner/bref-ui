<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { PillProps } from './types.js';

	let { label, onDelete }: Required<Pick<PillProps, 'label' | 'onDelete'>> = $props();
</script>

<button
	type="button"
	aria-label={`Remove ${label}`}
	onclick={(event) => {
		event.stopPropagation();
		onDelete();
	}}
>
	<Icon name="close" />
</button>

<style>
	button {
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--pill-delete-size, 1.5rem);
		height: var(--pill-delete-size, 1.5rem);
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: var(--pill-icon-size, 1.125rem);
		cursor: pointer;
	}
	button:hover {
		background: color-mix(in srgb, currentColor 8%, transparent);
	}
	button:active {
		background: color-mix(in srgb, currentColor 16%, transparent);
	}
	button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: -2px;
	}
	@media (pointer: coarse) {
		button {
			min-width: 44px;
			min-height: 44px;
		}
	}
</style>
