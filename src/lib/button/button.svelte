<script lang="ts">
	/* eslint-disable max-lines, svelte/consistent-selector-style -- Keep the shared button/link recipe scoped to .button. */
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
		openInNewTab = false,
		onClick,
		stylesOverride
	}: ButtonProps = $props();

	const isIcon = $derived(label === undefined);
	const isLink = $derived(href !== undefined);
</script>

<svelte:element
	this={isLink ? 'a' : 'button'}
	{...stylesOverride}
	class={['button', stylesOverride?.class]}
	type={!isLink ? (stylesOverride?.type ?? 'button') : undefined}
	href={disabled ? undefined : href}
	target={isLink && openInNewTab ? '_blank' : undefined}
	rel={isLink && openInNewTab ? 'noopener noreferrer' : undefined}
	disabled={!isLink ? disabled : undefined}
	aria-disabled={isLink ? disabled : stylesOverride?.['aria-disabled']}
	tabindex={isLink && disabled ? -1 : stylesOverride?.tabindex}
	onclick={!isLink ? onClick : stylesOverride?.onclick}
	aria-label={isIcon ? (icon?.label ?? icon?.name) : undefined}
	data-color={color}
	data-size={size}
	data-variant={variant}
	data-kind={isIcon ? 'icon' : 'normal'}
	data-wide={wide && !isIcon ? '' : undefined}
	data-rounded={rounded && isIcon ? '' : undefined}
	style:--internal-color={`var(--color-${color}, #28231f)`}
>
	{#if icon}
		<span><Icon {...icon} color={undefined} label={undefined} /></span>
	{/if}
	{#if !isIcon}
		{label}
		{#if trailingIcon}
			<span><Icon {...trailingIcon} color={undefined} label={undefined} /></span>
		{/if}
	{/if}
</svelte:element>

<style>
	.button {
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
	.button[data-size='x-small'] {
		--internal-height: max(28px, 1.75rem);
		--internal-padding: 0.5rem;
	}
	.button[data-size='small'] {
		--internal-height: max(40px, 2.5rem);
		--internal-padding: 0.875rem;
	}
	.button[data-size='large'] {
		--internal-height: max(64px, 4rem);
		--internal-padding: 1.5rem;
	}
	.button[data-size='x-large'] {
		--internal-height: max(80px, 5rem);
		--internal-padding: 2rem;
	}
	.button[data-kind='icon'] {
		width: var(--internal-height);
		height: var(--internal-height);
		padding: 0;
		font-size: var(--internal-icon-size);
	}
	span {
		display: inline-flex;
		font-size: var(--internal-icon-size);
	}
	.button[data-wide] {
		width: 100%;
	}
	.button[data-rounded] {
		border-radius: 50%;
	}
	.button[data-variant='soft'] {
		--internal-tint: 16%;
		--internal-content: color-mix(in srgb, var(--internal-color) 80%, var(--internal-foreground));
		--internal-surface: var(--internal-background);
		--internal-border: color-mix(in srgb, var(--internal-color) 30%, transparent);
		--internal-highlight: color-mix(in srgb, var(--internal-foreground) 16%, transparent);
	}
	.button[data-variant='filled'] {
		--internal-fill: color-mix(in srgb, var(--internal-color) 88%, var(--internal-foreground));
		--internal-content: color-mix(in srgb, var(--internal-background) 90%, var(--internal-color));
		--internal-border: color-mix(in srgb, var(--internal-color) 68%, var(--internal-foreground));
		--internal-highlight: color-mix(in srgb, var(--internal-foreground) 28%, transparent);
	}
	.button:is([data-variant='soft'], [data-variant='filled']) {
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
	}
	.button[data-color='foreground'] {
		--internal-state-color: var(--internal-background);
	}
	.button:not(:disabled, [aria-disabled='true']):is(:hover, :active) {
		--internal-tint: 22%;
		--internal-border: color-mix(in srgb, var(--internal-color) 40%, transparent);
	}
	.button:not(:disabled, [aria-disabled='true']):is(:hover, :active)[data-variant='neutral'] {
		--internal-tint: 5%;
		--internal-content: color-mix(in srgb, var(--internal-color) 90%, var(--internal-foreground));
	}
	.button:not(:disabled, [aria-disabled='true']):active {
		--internal-tint: 28%;
	}
	.button:not(:disabled, [aria-disabled='true']):active[data-variant='neutral'] {
		--internal-tint: 10%;
		--internal-content: color-mix(in srgb, var(--internal-color) 80%, var(--internal-foreground));
	}
	.button:not(:disabled, [aria-disabled='true']):active[data-variant='soft'] {
		--internal-content: color-mix(in srgb, var(--internal-color) 70%, var(--internal-foreground));
	}
	.button:not(:disabled, [aria-disabled='true']):is(:hover, :active)[data-variant='filled'] {
		--internal-fill: color-mix(in srgb, var(--internal-color) 86%, var(--internal-state-color));
	}
	.button:not(:disabled, [aria-disabled='true']):active[data-variant='filled'] {
		--internal-fill: color-mix(in srgb, var(--internal-color) 80%, var(--internal-state-color));
	}
	.button:focus-visible {
		outline: 2px solid var(--color-foreground, black);
		outline-offset: 3px;
	}
	.button:is(:disabled, [aria-disabled='true']) {
		opacity: 0.45;
		cursor: not-allowed;
	}
	@media (prefers-reduced-motion: reduce) {
		.button {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		.button {
			border-color: ButtonText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		.button:is(:disabled, [aria-disabled='true']) {
			color: GrayText;
			opacity: 1;
		}
		.button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
