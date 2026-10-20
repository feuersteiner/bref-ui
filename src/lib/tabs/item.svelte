<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import Icon from '../icon/icon.svelte';
	import type { TabItemProps } from './types.js';

	let {
		label,
		icon,
		disabled = false,
		selected,
		orientation = 'horizontal',
		size = 'fit',
		filled = false,
		onSelect,
		transitionIn = () => ({}),
		transitionOut = () => ({})
	}: TabItemProps = $props();
	const smallScreen = new MediaQuery('(max-width: 575px)', false);
	const showLabel = $derived(!smallScreen.current || (orientation === 'horizontal' && selected));
</script>

<button
	type="button"
	role="tab"
	aria-label={label}
	aria-selected={selected ?? false}
	data-size={orientation === 'horizontal' ? size : undefined}
	data-orientation={orientation}
	data-icon-only={!showLabel}
	tabindex={selected === undefined ? undefined : selected ? 0 : -1}
	{disabled}
	onclick={onSelect}
>
	<Icon name={icon} {filled} />
	{#if showLabel}<span>{label}</span>{/if}
	{#if selected}
		<i aria-hidden="true" in:transitionIn out:transitionOut></i>
	{/if}
</button>

<style>
	button {
		position: relative;
		box-sizing: border-box;
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 0.5rem;
		width: max-content;
		min-width: 44px;
		min-height: 48px;
		padding: 0.75rem 1rem;
		border: 0;
		background: transparent;
		color: var(--color-muted);
		font: inherit;
		font-weight: 500;
		line-height: 1.5;
		text-align: start;
		white-space: nowrap;
		cursor: pointer;
		transition:
			color 150ms ease,
			background-color 150ms ease;
	}
	button[data-size='fill'] {
		flex: 1 1 auto;
		width: auto;
		max-width: 100%;
		padding-inline: 0.5rem;
	}
	button[data-orientation='vertical'] {
		width: 100%;
		max-width: 100%;
	}
	button[data-icon-only='true'] {
		justify-content: center;
		padding-inline: 0.75rem;
	}
	button[aria-selected='true'],
	button:hover:not(:disabled) {
		color: var(--color-foreground);
	}
	button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-foreground) 3%, transparent);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -4px;
	}
	button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	span {
		display: block;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	i {
		position: absolute;
		inset-block: var(--tabs-indicator-block-start) 0;
		inset-inline: var(--tabs-indicator-inline-start) 0;
		width: var(--tabs-indicator-width);
		height: var(--tabs-indicator-height);
		background: var(--color-primary);
		pointer-events: none;
	}
	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button[aria-selected='true'] {
			outline: 2px solid Highlight;
			outline-offset: -2px;
		}
		button:focus-visible {
			outline-style: dashed;
		}
	}
</style>
