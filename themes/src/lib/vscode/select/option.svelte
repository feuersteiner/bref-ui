<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { OptionProps } from 'bref-ui/types';

	let { label, icon, disabled, selected, onSelect }: OptionProps = $props();
</script>

<button type="button" aria-pressed={selected} {disabled} onclick={onSelect}>
	{#if icon}<span data-icon><Icon {...icon} /></span>{/if}
	<span data-label>{label}</span>
	{#if selected}<span data-icon data-check><Icon name="check" /></span>{/if}
</button>

<style>
	button {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		min-width: 0;
		min-height: var(--internal-row-height);
		padding: 0 8px;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--color-foreground);
		font: inherit;
		font-size: 13px;
		font-weight: 400;
		line-height: 18px;
		text-align: left;
		cursor: pointer;
		transition: background-color 150ms ease;
	}
	[data-label] {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	[data-icon] {
		display: inline-flex;
		flex: 0 0 auto;
		font-size: var(--internal-icon-size);
	}
	[data-check] {
		color: inherit;
	}
	button[aria-pressed='true'] {
		background: #04395e;
		color: #ffffff;
	}
	button:hover:not(:disabled) {
		background: #2a2d2e;
	}
	button[aria-pressed='true']:hover:not(:disabled) {
		background: #04395e;
	}
	button:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: -1px;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button:focus-visible {
			outline-color: Highlight;
		}
		button[aria-pressed='true'] {
			outline: 1px solid Highlight;
		}
	}
	@media (forced-colors: active) {
		button[aria-pressed='true'] {
			background: Highlight;
			color: HighlightText;
		}
	}
</style>
