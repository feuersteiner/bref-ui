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
	{#if selected}<span data-icon><Icon name="check" /></span>{/if}
</button>

<style>
	button {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		min-height: var(--internal-height);
		padding: 0.375rem 0.65rem;
		border: 0;
		border-radius: 0.4rem;
		background: transparent;
		color: var(--color-foreground);
		font: inherit;
		text-align: left;
		cursor: pointer;
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
	button:hover:not(:disabled),
	button[aria-selected='true'],
	button[data-active] {
		background: color-mix(in srgb, var(--color-primary) 12%, transparent);
		color: var(--color-primary);
	}
	button[data-active],
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	@media (forced-colors: active) {
		button[data-active],
		button:focus-visible {
			outline-color: Highlight;
		}
		button[aria-selected='true'] {
			outline: 1px solid Highlight;
		}
	}
</style>
