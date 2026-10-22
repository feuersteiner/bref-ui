<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import Icon from '../icon/icon.svelte';
	import { surface } from '../theme/surface.js';
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
	<Icon name={icon} filled={filled || selected === true} />
	{#if showLabel}<span>{label}</span>{/if}
	{#if selected}
		<i
			class={surface({ color: 'primary', variant: 'soft', glass: true })}
			aria-hidden="true"
			in:transitionIn
			out:transitionOut
		></i>
	{/if}
</button>

<style>
	button {
		--internal-selected-foreground: color-mix(
			in srgb,
			var(--color-primary) 80%,
			var(--color-foreground)
		);
		--internal-hover-background: color-mix(in srgb, var(--color-primary) 5%, transparent);
		position: relative;
		isolation: isolate;
		box-sizing: border-box;
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: max-content;
		min-width: 44px;
		min-height: 44px;
		padding: 0.5rem 0.875rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--color-primary);
		font: inherit;
		font-size: 0.875rem;
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
		justify-content: start;
		width: 100%;
		max-width: 100%;
	}
	button[data-icon-only='true'] {
		justify-content: center;
		padding-inline: 0.75rem;
	}
	button[aria-selected='true'] {
		color: var(--internal-selected-foreground);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
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
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		pointer-events: none;
	}
	@media (hover: hover) {
		button:hover:not(:disabled, [aria-selected='true']) {
			background: var(--internal-hover-background);
			color: var(--color-primary);
		}
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
