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
	<Content {label} {icon} {size} />
	{@render children?.()}
	{#if onDelete}<OnDelete {label} {onDelete} />{/if}
</div>

<style>
	div {
		--pill-tint: 3%;
		--pill-background: color-mix(
			in srgb,
			color-mix(in srgb, var(--pill-color) var(--pill-tint), var(--color-background, white)) 85%,
			transparent
		);
		--pill-border: color-mix(in srgb, var(--pill-color) 20%, transparent);
		--pill-highlight: color-mix(in srgb, var(--color-foreground, black) 16%, transparent);
		--pill-content: var(--pill-color);
		--pill-padding: 1.125rem;
		--pill-height: 3rem;
		box-sizing: border-box;
		display: inline-flex;
		position: relative;
		isolation: isolate;
		align-items: center;
		gap: 0.5rem;
		justify-content: center;
		min-width: 0;
		max-width: 100%;
		min-height: var(--pill-height);
		padding: 0.25rem var(--pill-padding);
		border: 1px solid var(--pill-border);
		border-radius: 999px;
		background: var(--pill-background);
		box-shadow:
			inset 0 1px 0 var(--pill-highlight),
			0 2px 6px color-mix(in srgb, var(--color-foreground, black) 8%, transparent);
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
		transition: all 150ms;
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
		--pill-height: 1.75rem;
		--pill-padding: 0.5rem;
		font-size: 0.8rem;
	}
	div[data-size='small'] {
		--pill-height: 2.5rem;
		--pill-padding: 0.875rem;
	}
	div[data-size='large'] {
		--pill-height: 4rem;
		--pill-padding: 1.5rem;
		font-size: 1.25rem;
	}
	div[data-size='x-large'] {
		--pill-height: 5rem;
		--pill-padding: 2rem;
		font-size: 1.5rem;
	}
	div[data-variant='soft'] {
		--pill-tint: 16%;
		--pill-border: color-mix(in srgb, var(--pill-color) 30%, transparent);
		--pill-content: color-mix(in srgb, var(--pill-color) 80%, var(--color-foreground, black));
	}
	div[data-variant='filled'] {
		--pill-tint: 88%;
		--pill-border: color-mix(in srgb, var(--pill-color) 68%, var(--color-foreground, black));
		--pill-highlight: color-mix(in srgb, var(--color-foreground, black) 28%, transparent);
		--pill-content: color-mix(in srgb, var(--color-background, white) 90%, var(--pill-color));
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
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--pill-color) 28%, transparent),
			transparent
		);
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
