<script lang="ts">
	/* eslint-disable max-lines -- Component recipe and animation remain colocated. */
	import type { PillProps } from './types.js';
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
		...attributes
	}: PillProps = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (The button role and tab stop are enabled together.) -->
<div
	{...attributes}
	onclick={onClick}
	role={onClick ? 'button' : attributes.role}
	tabindex={onClick ? (attributes.tabindex ?? 0) : attributes.tabindex}
	aria-label={attributes['aria-labelledby']
		? undefined
		: (attributes['aria-label'] ?? (onClick ? label : undefined))}
	onkeydown={onClick
		? (event) => {
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
		: attributes.onkeydown}
	data-swoosh={swoosh || undefined}
	data-clickable={onClick ? '' : undefined}
	data-icon={icon ? '' : undefined}
	data-removable={onDelete ? '' : undefined}
	data-color={color}
	data-size={size}
	data-variant={variant}
	style:--pill-color={`var(--color-${color}, var(--color-foreground))`}
	data-wide={wide}
>
	<Content {label} {icon} />
	{@render children?.()}
	{#if onDelete}<OnDelete {label} {onDelete} />{/if}
</div>

<style>
	div {
		--pill-hover: var(--pill-choice-hover, 0%);
		--pill-tint: calc(3% + var(--pill-hover));
		--pill-background: color-mix(
			in srgb,
			var(--pill-color) var(--pill-tint),
			var(--color-background, white)
		);
		--pill-content: color-mix(in srgb, var(--pill-color) 90%, var(--color-foreground, black));
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
		justify-content: center;
		min-width: 0;
		max-width: 100%;
		min-height: var(--pill-height);
		padding: 0.125rem var(--pill-padding);
		border: 1px solid transparent;
		border-radius: 999px;
		background: var(--pill-background);
		transition:
			background-color 150ms ease,
			color 150ms ease;
		color: var(--pill-content);
		font: inherit;
		line-height: 1.25;
		text-align: center;
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
	div[data-variant='soft'] {
		--pill-tint: calc(var(--pill-choice-emphasis, 12%) + var(--pill-hover));
		--pill-content: color-mix(in srgb, var(--pill-color) 80%, var(--color-foreground, black));
	}
	div[data-variant='filled'] {
		--pill-tint: calc(100% - var(--pill-hover) / 2);
		--pill-content: var(--color-background, white);
		--pill-glint: color-mix(in srgb, var(--pill-color) 28%, transparent);
	}
	div:is([data-clickable], [data-removable]):not([aria-disabled='true']):is(
			:hover,
			:focus-visible
		) {
		--pill-hover: 2%;
	}
	div:is([data-clickable], [data-removable]):not([aria-disabled='true']):active {
		--pill-hover: 4%;
	}
	div[data-icon] {
		padding-left: calc(var(--pill-padding) * 0.6);
	}
	div[data-removable] {
		padding-right: calc(var(--pill-padding) / 2);
	}
	div[data-clickable] {
		cursor: pointer;
	}
	div[data-clickable]:focus-visible {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
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
	div[data-wide='true'] {
		width: 100%;
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
		div {
			transition: none;
		}
		div[data-swoosh]::before {
			animation: none;
		}
	}
	@media (forced-colors: active) {
		div {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
</style>
