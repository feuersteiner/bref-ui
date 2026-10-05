<script lang="ts">
	/* eslint-disable svelte/consistent-selector-style -- Keep the shared button/link geometry scoped to .button. */
	import Icon from '../icon/icon.svelte';
	import { surface } from '../theme/surface.js';
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
	class={[
		'button',
		surface({ variant, color, shadow: 'small', hover: 'medium' }),
		stylesOverride?.class
	]}
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
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-transform: capitalize;
		gap: 0.5rem;
		min-height: var(--internal-height);
		min-width: 24px;
		padding: 0.25rem var(--internal-padding);
		border-radius: 0.45rem;
		font: inherit;
		font-size: 1rem;
		text-decoration: none;
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
</style>
