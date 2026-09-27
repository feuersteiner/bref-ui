<script lang="ts">
	/* eslint-disable max-lines, svelte/no-navigation-without-resolve -- Library hrefs are consumer-provided; keep the scoped styling recipe with its markup. */
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import Icon from '../icon/icon.svelte';
	import type { ButtonProps } from './types.js';

	let {
		color = 'foreground',
		size = 'medium',
		variant = 'neutral',
		label,
		icon,
		trailingIcon,
		wide = false,
		rounded = false,
		disabled = false,
		href,
		onClick,
		stylesOverride
	}: ButtonProps = $props();

	const isIcon = $derived(label === undefined);
	const anchorStylesOverride = $derived(stylesOverride as HTMLAnchorAttributes | undefined);
</script>

{#snippet content()}
	{#if icon}
		<span><Icon {...icon} label={undefined} /></span>
	{/if}
	{#if !isIcon}
		{label}
		{#if trailingIcon}
			<span><Icon {...trailingIcon} label={undefined} /></span>
		{/if}
	{/if}
{/snippet}

{#if href !== undefined}
	<a
		{...anchorStylesOverride}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		tabindex={disabled ? -1 : undefined}
		aria-label={isIcon ? (icon?.label ?? icon?.name) : undefined}
		data-color={color}
		data-size={size}
		data-variant={variant}
		data-kind={isIcon ? 'icon' : 'normal'}
		data-wide={wide && !isIcon ? '' : undefined}
		data-rounded={rounded && isIcon ? '' : undefined}
		style:--internal-color={`var(--color-${color}, #28231f)`}
	>
		{@render content()}
	</a>
{:else}
	<button
		type="button"
		{...stylesOverride}
		{disabled}
		onclick={onClick}
		aria-label={isIcon ? (icon?.label ?? icon?.name) : undefined}
		data-color={color}
		data-size={size}
		data-variant={variant}
		data-kind={isIcon ? 'icon' : 'normal'}
		data-wide={wide && !isIcon ? '' : undefined}
		data-rounded={rounded && isIcon ? '' : undefined}
		style:--internal-color={`var(--color-${color}, #28231f)`}
	>
		{@render content()}
	</button>
{/if}

<style>
	:is(button, a) {
		--internal-height: max(48px, 3rem);
		--internal-padding: 1.125rem;
		--internal-icon-size: calc(var(--internal-height) / 2 + 0.25rem);
		--internal-background: var(--color-background, white);
		--internal-foreground: var(--color-foreground, black);
		--internal-state-color: var(--internal-foreground);
		--internal-surface: transparent;
		--internal-fill: color-mix(
			in srgb,
			var(--internal-color) var(--internal-tint),
			var(--internal-surface)
		);
		--internal-content: var(--internal-color);
		--internal-tint: 0%;
		--internal-border: transparent;
		--internal-highlight: transparent;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-transform: capitalize;
		gap: 0.5rem;
		min-height: var(--internal-height);
		min-width: 24px;
		padding: 0.25rem var(--internal-padding);
		border: 1px solid var(--internal-border);
		border-radius: 0.45rem;
		background: var(--internal-fill);
		box-shadow: inset 0 1px 0 var(--internal-highlight);
		color: var(--internal-content);
		font: inherit;
		font-size: 1rem;
		cursor: pointer;
		text-decoration: none;
		transition:
			background-color 120ms ease,
			border-color 120ms ease,
			box-shadow 120ms ease,
			color 120ms ease;
	}
	:is(button, a)[data-size='x-small'] {
		--internal-height: max(28px, 1.75rem);
		--internal-padding: 0.5rem;
	}
	:is(button, a)[data-size='small'] {
		--internal-height: max(40px, 2.5rem);
		--internal-padding: 0.875rem;
	}
	:is(button, a)[data-size='large'] {
		--internal-height: max(64px, 4rem);
		--internal-padding: 1.5rem;
	}
	:is(button, a)[data-size='x-large'] {
		--internal-height: max(80px, 5rem);
		--internal-padding: 2rem;
	}
	:is(button, a)[data-kind='icon'] {
		width: var(--internal-height);
		height: var(--internal-height);
		padding: 0;
		font-size: var(--internal-icon-size);
	}
	span {
		display: inline-flex;
		font-size: var(--internal-icon-size);
	}
	:is(button, a)[data-wide] {
		width: 100%;
	}
	:is(button, a)[data-rounded] {
		border-radius: 50%;
	}
	:is(button, a)[data-variant='soft'] {
		--internal-tint: 12%;
		--internal-content: var(--internal-foreground);
		--internal-surface: color-mix(in srgb, var(--internal-background) 80%, transparent);
		--internal-border: color-mix(in srgb, var(--internal-color) 30%, transparent);
		--internal-highlight: color-mix(in srgb, var(--internal-foreground) 16%, transparent);
	}
	:is(button, a)[data-variant='filled'] {
		--internal-fill: color-mix(in srgb, var(--internal-color) 97%, transparent);
		--internal-content: var(--internal-background);
		--internal-border: color-mix(in srgb, var(--internal-color) 68%, var(--internal-foreground));
		--internal-highlight: color-mix(in srgb, var(--internal-foreground) 28%, transparent);
	}
	:is(button, a):is([data-variant='soft'], [data-variant='filled']) {
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
	}
	:is(button, a)[data-color='foreground'] {
		--internal-state-color: var(--internal-background);
	}
	:is(button, a):not(:disabled, [aria-disabled='true']):is(:hover, :active) {
		--internal-tint: 16%;
		--internal-content: var(--internal-foreground);
	}
	:is(button, a)[data-variant='neutral']:not(:disabled, [aria-disabled='true']):is(
			:hover,
			:active
		) {
		--internal-surface: var(--internal-background);
	}
	:is(button, a):not(:disabled, [aria-disabled='true']):active {
		--internal-tint: 22%;
	}
	:is(button, a)[data-variant='filled']:not(:disabled, [aria-disabled='true']):is(:hover, :active) {
		--internal-content: var(--internal-background);
		--internal-fill: color-mix(in srgb, var(--internal-color) 92%, var(--internal-state-color));
	}
	:is(button, a)[data-variant='filled']:not(:disabled, [aria-disabled='true']):active {
		--internal-fill: color-mix(in srgb, var(--internal-color) 84%, var(--internal-state-color));
	}
	:is(button, a):focus-visible {
		outline: 2px solid var(--internal-foreground);
		outline-offset: 3px;
	}
	:is(button, a):is(:disabled, [aria-disabled='true']) {
		opacity: 0.45;
		cursor: not-allowed;
	}
	@media (prefers-reduced-motion: reduce) {
		:is(button, a) {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		:is(button, a) {
			border-color: ButtonText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		:is(button, a):is(:disabled, [aria-disabled='true']) {
			color: GrayText;
			opacity: 1;
		}
		:is(button, a):focus-visible {
			outline-color: Highlight;
		}
	}
</style>
