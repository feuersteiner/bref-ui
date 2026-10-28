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
		gap: 0.6rem;
		width: 100%;
		min-width: 0;
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
	button[aria-pressed='true'] {
		background: color-mix(in srgb, var(--color-primary) 8%, transparent);
	}
	button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
	}
	button[aria-pressed='true']:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-primary) 14%, transparent);
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
		button:focus-visible {
			outline-color: Highlight;
		}
		button[aria-pressed='true'] {
			outline: 1px solid Highlight;
		}
	}

	:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: 3px;
	}
	button:has(> [data-label]) {
		background: transparent;
		color: var(--color-muted);
	}
	button:has(> [data-label]):is(:hover:not(:disabled), [aria-pressed='true']) {
		color: var(--crystal-code-bright);
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (forced-colors: active) {
		:focus-visible {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none;
			transition: none;
		}
	}
</style>
