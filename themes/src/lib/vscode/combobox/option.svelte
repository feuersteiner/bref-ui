<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { ComboboxOptionProps } from 'bref-ui/types';

	let { id, item, selected, active, onSelect }: ComboboxOptionProps = $props();
</script>

<button
	{id}
	type="button"
	role="option"
	tabindex={-1}
	aria-selected={selected}
	data-active={active || undefined}
	disabled={item.disabled}
	onmousedown={(event) => event.preventDefault()}
	onclick={onSelect}
>
	{#if item.icon}<span data-icon><Icon {...item.icon} /></span>{/if}
	<span data-label>{item.label}</span>
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
	button[aria-selected='true'] {
		background: #04395e;
		color: #ffffff;
	}
	button:hover:not(:disabled, [data-active]) {
		background: #2a2d2e;
	}
	button[aria-selected='true']:hover:not(:disabled, [data-active]) {
		background: #04395e;
	}
	button[data-active] {
		background: #04395e;
		color: #ffffff;
	}
	button[aria-selected='true'][data-active] {
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
		button[data-active] {
			outline: 1px solid Highlight;
			outline-offset: -1px;
		}
		button:focus-visible {
			outline-color: Highlight;
		}
		button[aria-selected='true'] {
			outline: 1px solid Highlight;
		}
	}

	:focus-visible {
		outline-color: var(--color-primary);
		outline-offset: -1px;
	}
	button {
		border-radius: 0;
	}
	@media (forced-colors: active) {
		:focus-visible {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: -1px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none;
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button[aria-selected='true'],
		button[data-active] {
			background: Highlight;
			color: HighlightText;
		}
	}
</style>
