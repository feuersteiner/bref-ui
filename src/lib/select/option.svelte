<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import type { SelectOptionDataProps } from './types.js';

	let {
		item,
		id,
		selected,
		active,
		onSelect
	}: {
		item: SelectOptionDataProps;
		id: string;
		selected: boolean;
		active: boolean;
		onSelect: () => void;
	} = $props();
</script>

<button
	{id}
	type="button"
	role="option"
	tabindex="-1"
	aria-selected={selected}
	aria-disabled={item.disabled || undefined}
	data-active={active || undefined}
	disabled={item.disabled}
	onpointerdown={(event) => event.preventDefault()}
	onclick={onSelect}
>
	{#if item.icon}<span data-icon><Icon {...item.icon} /></span>{/if}
	<span data-label>{item.label}</span>
	<span data-check>
		{#if selected}
			<span in:fly|global={{ delay: 100, duration: 200, x: -6 }}>
				<Icon name="check" />
			</span>
		{/if}
	</span>
</button>

<style>
	button {
		box-sizing: border-box;
		display: flex;
		width: 100%;
		min-height: var(--option-height, 2.5rem);
		align-items: center;
		gap: 0.6rem;
		padding: 0.375rem 0.65rem;
		border: 0;
		border-radius: 0.4rem;
		background: transparent;
		color: var(--color-foreground, black);
		font: inherit;
		font-size: 1rem;
		font-weight: 200;
		line-height: 1.4;
		text-align: left;
		cursor: pointer;
		transition: all 150ms ease;
	}
	[data-label] {
		min-width: 0;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	[data-icon],
	[data-check],
	[data-check] > span {
		display: inline-flex;
		flex: 0 0 auto;
		font-size: var(--option-icon-size, 1.25rem);
		color: var(--color-muted, #666);
	}
	[data-check] {
		width: 1em;
		color: inherit;
	}
	[data-check] > span {
		color: inherit;
	}
	button[data-active],
	button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-foreground, black) 6%, transparent);
	}
	button[aria-selected='true'] {
		background: color-mix(in srgb, var(--color-primary, blue) 12%, transparent);
		color: var(--color-primary, blue);
	}
	button[aria-selected='true'] [data-icon] {
		color: inherit;
	}
	button[aria-selected='true'][data-active],
	button[aria-selected='true']:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-primary, blue) 18%, transparent);
	}
	button:disabled {
		color: var(--color-muted);
		cursor: not-allowed;
		opacity: 0.5;
	}
	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button[data-active] {
			outline: 2px solid Highlight;
		}
		button:disabled {
			color: GrayText;
		}
	}
</style>
