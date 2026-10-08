<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { ComboboxOptionProps } from './types.js';

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
		gap: 0.6rem;
		width: 100%;
		min-height: var(--internal-row-height);
		padding: 0.375rem 0.65rem;
		border: 0;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--color-foreground);
		font: inherit;
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
		color: var(--color-primary);
	}
	button[aria-selected='true'] {
		background: color-mix(in srgb, var(--color-primary) 8%, transparent);
	}
	button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
	}
	button[aria-selected='true']:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-primary) 14%, transparent);
	}
	button[data-active] {
		background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
	}
	button[aria-selected='true'][data-active] {
		background: color-mix(in srgb, var(--color-primary) 18%, transparent);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
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
			outline: 2px solid Highlight;
			outline-offset: -2px;
		}
		button:focus-visible {
			outline-color: Highlight;
		}
		button[aria-selected='true'] {
			outline: 1px solid Highlight;
		}
	}
</style>
