<script lang="ts">
	/* eslint-disable max-lines -- Component recipe and animation remain colocated. */
	import type { PillProps } from './types.js';
	import { surface } from '../theme/surface.js';
	import Content from './content.svelte';
	import OnDelete from './on-delete.svelte';

	let {
		children,
		label,
		icon,
		onClick,
		onDelete,
		swoosh = false,
		color = 'foreground',
		size = 'medium',
		variant = 'neutral',
		wide = false,
		class: className,
		glass,
		...attributes
	}: PillProps = $props();

	const nativeAttributes = $derived({
		...attributes,
		onclick: onClick,
		role: onClick ? 'button' : attributes.role,
		tabindex: onClick ? (attributes.tabindex ?? 0) : attributes.tabindex,
		'aria-label': attributes['aria-labelledby']
			? undefined
			: (attributes['aria-label'] ?? (onClick ? label : undefined)),
		onkeydown: onClick
			? (event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
					attributes.onkeydown?.(event);
					if (
						!event.defaultPrevented &&
						event.target === event.currentTarget &&
						(event.key === 'Enter' || event.key === ' ')
					) {
						event.preventDefault();
						if (!event.repeat) event.currentTarget.click();
					}
				}
			: attributes.onkeydown
	});
</script>

<div
	{...nativeAttributes}
	class={[
		surface({
			color,
			variant,
			glass,
			hover: onClick || onDelete ? 'small' : undefined
		}),
		className
	]}
	data-swoosh={swoosh || undefined}
	data-clickable={onClick ? '' : undefined}
	data-icon={icon ? '' : undefined}
	data-removable={onDelete ? '' : undefined}
	data-color={color}
	data-size={size}
	data-variant={variant}
	data-wide={wide}
>
	<Content {label} {icon} />
	{@render children?.()}
	<!-- todo: the on delete should always be at right msot of the pill, content has to "fill the parent" -->
	{#if onDelete}<OnDelete {label} {onDelete} />{/if}
</div>

<style>
	div {
		--pill-glint: color-mix(in srgb, var(--color-foreground, black) 8%, transparent);
		--pill-padding: 0.75rem;
		--pill-height: 2rem;
		--pill-icon-size: 1.125rem;
		--pill-delete-size: 1.5rem;
		box-sizing: border-box;
		display: inline-flex;
		position: relative;
		isolation: isolate;
		align-items: center;
		gap: 0.375rem;
		justify-content: flex-start;
		min-width: 0;
		width: fit-content;
		max-width: 100%;
		min-height: var(--pill-height);
		padding: 0.125rem var(--pill-padding);
		border-radius: 999px;
		font: inherit;
		line-height: 1.25;
		text-align: left;
		white-space: normal;
		overflow-wrap: anywhere;
		overflow: hidden;
		user-select: none;
	}
	div[data-size='x-small'] {
		--pill-height: 1.5rem;
		--pill-padding: 0.5rem;
		--pill-icon-size: 0.875rem;
		font-size: 0.8125rem;
	}
	div[data-size='small'] {
		--pill-height: 1.75rem;
		--pill-padding: 0.625rem;
		--pill-icon-size: 1rem;
		font-size: 0.875rem;
	}
	div[data-size='large'] {
		--pill-height: 2.25rem;
		--pill-padding: 0.875rem;
		--pill-icon-size: 1.25rem;
		--pill-delete-size: 1.75rem;
	}
	div[data-size='x-large'] {
		--pill-height: 2.5rem;
		--pill-padding: 1rem;
		--pill-icon-size: 1.375rem;
		--pill-delete-size: 2rem;
		font-size: 1.125rem;
	}
	div[data-variant='filled'] {
		--pill-glint: color-mix(in srgb, var(--surface-color) 28%, transparent);
	}
	div[data-icon] {
		padding-left: calc(var(--pill-padding) * 0.6);
	}
	div[data-removable] {
		padding-right: calc(var(--pill-padding) / 2);
	}
	div[data-wide='true'] {
		width: 100%;
	}
	div[data-swoosh]::before {
		position: absolute;
		z-index: -1;
		inset-block: -50%;
		inset-inline-start: -45%;
		width: 40%;
		content: '';
		background: linear-gradient(90deg, transparent, var(--pill-glint), transparent);
		filter: blur(0.3rem);
		opacity: 0;
		pointer-events: none;
		transform: skewX(-18deg);
		animation: pill-swoosh 2s ease-in-out infinite;
	}
	@keyframes pill-swoosh {
		0%,
		20% {
			opacity: 0;
			transform: translateX(0) skewX(-18deg);
		}
		45%,
		60% {
			opacity: 0.75;
		}
		80%,
		100% {
			opacity: 0;
			transform: translateX(400%) skewX(-18deg);
		}
	}
	@media (pointer: coarse) {
		div[data-clickable] {
			min-width: 44px;
			min-height: 44px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		div[data-swoosh]::before {
			animation: none;
		}
	}
</style>
