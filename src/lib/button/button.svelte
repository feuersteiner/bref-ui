<script lang="ts">
	/* eslint-disable svelte/consistent-selector-style -- Keep the shared button/link geometry scoped to .button. */
	import Icon from '../icon/icon.svelte';
	import { surface } from '../theme/surface.js';
	import type { ButtonProps } from './types.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	let {
		color = 'foreground',
		size = 'medium',
		variant = 'neutral',
		glass = false,
		label,
		icon,
		trailingIcon,
		wide = false,
		rounded = false,
		disabled = false,
		href,
		onClick,
		class: className,
		...attributes
	}: ButtonProps = $props();

	const isIcon = $derived(label === undefined);
	const isLink = $derived(href !== undefined);
	const common = $derived({
		class: ['button', surface({ variant, color, hover: 'medium' }), glass && 'glass', className],
		'aria-label': attributes['aria-label'] ?? (isIcon ? (icon?.label ?? icon?.name) : undefined),
		'data-color': color,
		'data-size': size,
		'data-variant': variant,
		'data-kind': isIcon ? 'icon' : 'normal',
		'data-wide': wide && !isIcon ? '' : undefined,
		'data-rounded': rounded && isIcon ? '' : undefined
	});
</script>

{#snippet content()}
	{#if icon}
		<span><Icon {...icon} color={undefined} label={undefined} /></span>
	{/if}
	{#if !isIcon}
		{label}
		{#if trailingIcon}
			<span><Icon {...trailingIcon} color={undefined} label={undefined} /></span>
		{/if}
	{/if}
{/snippet}

{#if isLink}
	<!-- eslint-disable svelte/no-navigation-without-resolve -- Native library links also support consumers outside SvelteKit. -->
	<a
		{...attributes as HTMLAnchorAttributes}
		{...common}
		href={disabled ? undefined : href}
		aria-disabled={disabled ? true : attributes['aria-disabled']}
		tabindex={disabled ? -1 : attributes.tabindex}
		onclick={disabled ? (event) => event.preventDefault() : onClick}
	>
		{@render content()}
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
	<button
		{...attributes as HTMLButtonAttributes}
		{...common}
		type={(attributes as HTMLButtonAttributes).type ?? 'button'}
		{disabled}
		onclick={onClick}
	>
		{@render content()}
	</button>
{/if}

<style>
	.button {
		--internal-height: max(40px, 2.5rem);
		--internal-target: 24px;
		--internal-padding: 1rem;
		--internal-icon-size: 1.25rem;
		--internal-font-size: 1rem;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: max(var(--internal-height), var(--internal-target));
		min-width: var(--internal-target);
		padding: 0.25rem var(--internal-padding);
		border-radius: 0.625rem;
		font: inherit;
		font-size: var(--internal-font-size);
		line-height: 1.25;
		text-decoration: none;
	}
	.button[data-size='x-small'] {
		--internal-height: max(28px, 1.75rem);
		--internal-padding: 0.625rem;
		--internal-icon-size: 1rem;
		--internal-font-size: 0.8125rem;
	}
	.button[data-size='small'] {
		--internal-height: max(32px, 2rem);
		--internal-padding: 0.75rem;
		--internal-icon-size: 1.125rem;
		--internal-font-size: 0.875rem;
	}
	.button[data-size='large'] {
		--internal-height: max(48px, 3rem);
		--internal-padding: 1.25rem;
		--internal-icon-size: 1.5rem;
	}
	.button[data-size='x-large'] {
		--internal-height: max(56px, 3.5rem);
		--internal-padding: 1.5rem;
		--internal-icon-size: 1.75rem;
		--internal-font-size: 1.125rem;
	}
	.button[data-kind='icon'] {
		width: max(var(--internal-height), var(--internal-target));
		height: max(var(--internal-height), var(--internal-target));
		padding: 0;
		font-size: var(--internal-icon-size);
	}
	span {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
		font-size: var(--internal-icon-size);
		line-height: 1;
	}
	.button[data-wide] {
		width: 100%;
	}
	.button[data-rounded] {
		border-radius: 50%;
	}
	.button:is(:disabled, [aria-disabled='true']) {
		--surface-color: var(--color-muted, gray);
	}
	.button[data-variant='filled']:not(:disabled, [aria-disabled='true']):is(:hover, :focus-visible) {
		filter: brightness(1.1);
	}
	.button[data-variant='filled']:not(:disabled, [aria-disabled='true']):is(
			:active,
			[aria-pressed='true'],
			[data-surface-pressed='true']
		) {
		filter: brightness(0.85);
	}
	@media (pointer: coarse) {
		.button {
			--internal-target: 44px;
		}
	}
</style>
