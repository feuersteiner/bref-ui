<script lang="ts">
	import type { PillProps } from 'bref-ui/types';
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
	.bref-surface {
		--surface-color: var(--color-foreground, black);
		--surface-base: var(--color-background, white);
		--surface-foreground: var(--color-foreground, black);
		--surface-tint: var(--surface-color);
		--surface-soft-strength: 24%;
		--surface-neutral-strength: 2%;
		--surface-strength: var(--surface-neutral-strength);
		--surface-hover: 0%;
		--surface-fill: color-mix(in srgb, var(--surface-tint) var(--surface-strength), transparent);
		--surface-border: transparent;
		--surface-content: var(--surface-color);
		--surface-neutral-content: color-mix(
			in srgb,
			var(--surface-color) 80%,
			var(--surface-foreground)
		);
		--surface-highlight: 0 0 0 transparent;
		--surface-shadow: 0 0 0 transparent;
		box-sizing: border-box;
		border: 1px solid var(--surface-border);
		background: var(--surface-fill);
		color: var(--surface-content);
		box-shadow: var(--surface-highlight), var(--surface-shadow);
		transition:
			background-color 150ms ease,
			border-color 150ms ease,
			box-shadow 150ms ease,
			color 150ms ease;
	}
	.bref-surface-primary {
		--surface-color: var(--color-primary, blue);
	}
	.bref-surface-secondary {
		--surface-color: var(--color-secondary, purple);
	}
	.bref-surface-foreground {
		--surface-color: var(--color-foreground, black);
	}
	.bref-surface-background {
		--surface-color: var(--color-background, white);
		--surface-tint: var(--surface-foreground);
		--surface-soft-strength: 5%;
		--surface-content: inherit;
		--surface-neutral-content: inherit;
	}
	.bref-surface-muted {
		--surface-color: var(--color-muted, gray);
	}
	.bref-surface-info {
		--surface-color: var(--color-info, blue);
	}
	.bref-surface-success {
		--surface-color: var(--color-success, green);
	}
	.bref-surface-warning {
		--surface-color: var(--color-warning, brown);
	}
	.bref-surface-error {
		--surface-color: var(--color-error, red);
	}
	.bref-surface-soft {
		--surface-strength: var(--surface-soft-strength);
		--surface-fill: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-strength),
			var(--surface-base)
		);
		--surface-content: color-mix(in srgb, var(--surface-color) 80%, var(--surface-foreground));
	}
	.bref-surface-filled {
		--surface-strength: 100%;
		--surface-fill: color-mix(
			in srgb,
			var(--surface-color) var(--surface-strength),
			var(--surface-foreground)
		);
		--surface-content: var(--surface-base);
	}
	.bref-surface-background.bref-surface-filled {
		--surface-fill: color-mix(
			in srgb,
			var(--surface-base) var(--surface-strength),
			var(--surface-foreground)
		);
	}
	.bref-surface-background:is(.bref-surface-soft, .bref-surface-filled) {
		--surface-content: var(--surface-foreground);
	}
	.bref-surface-shadow-small {
		--surface-shadow: 0 2px 6px color-mix(in srgb, black 8%, transparent);
	}
	.bref-surface-shadow-medium {
		--surface-shadow: 0 0.5rem 1.5rem color-mix(in srgb, black 12%, transparent);
	}
	.bref-surface-shadow-large {
		--surface-shadow: 0 1.5rem 4rem color-mix(in srgb, black 20%, transparent);
	}
	.bref-surface-hover-small {
		--surface-hover: 2%;
	}
	.bref-surface-hover-medium {
		--surface-hover: 4%;
	}

	.bref-surface-soft:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:hover,
			:focus-visible,
			[data-surface-pressed='true']
		) {
		--surface-strength: calc(var(--surface-soft-strength) + var(--surface-hover));
	}

	.bref-surface-filled:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:hover,
			:focus-visible,
			[data-surface-pressed='true']
		) {
		--surface-strength: calc(100% - var(--surface-hover));
	}

	.bref-surface-neutral:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:hover,
			:focus-visible,
			[data-surface-pressed='true']
		) {
		--surface-strength: calc(var(--surface-neutral-strength) + var(--surface-hover));
		--surface-content: var(--surface-neutral-content);
	}
	.bref-surface:is(:focus-visible, [data-surface-focused='true']) {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
	}
	.bref-surface[data-surface-invalid='true'] {
		border-color: var(--color-error, red);
	}
	.bref-surface:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true']) {
		opacity: 0.45;
		cursor: not-allowed;
	}
	@media (prefers-reduced-motion: reduce) {
		.bref-surface {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		.bref-surface {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		.bref-surface:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true']) {
			color: GrayText;
			opacity: 1;
		}
		.bref-surface:is(:focus-visible, [data-surface-focused='true']) {
			outline-color: Highlight;
		}
	}

	.bref-glass {
		--glass-paint: var(--surface-fill, var(--color-background, white));
		--glass-opacity: 20%;
		--glass-blur: blur(0.75rem) saturate(120%);
	}
	.bref-glass {
		background: var(--glass-paint);
		color: var(--surface-content, var(--color-foreground, black));
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--color-foreground, black) 8%, transparent),
			var(--surface-shadow, 0 0.5rem 1.5rem color-mix(in srgb, black 12%, transparent));
	}
	.bref-glass:where(.bref-surface-neutral) {
		--glass-paint: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-strength),
			var(--surface-base)
		);
	}
	.bref-glass:where(.bref-surface-soft) {
		--glass-opacity: 40%;
	}
	.bref-glass:where(.bref-surface-filled) {
		--glass-opacity: 65%;
	}
	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.bref-glass {
			background: color-mix(in srgb, var(--glass-paint) var(--glass-opacity), transparent);
			-webkit-backdrop-filter: var(--glass-blur);
			backdrop-filter: var(--glass-blur);
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-glass {
			background: var(--glass-paint);
			box-shadow: var(--surface-shadow, 0 0 0 transparent);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-glass {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}

		.bref-glass:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true']) {
			color: GrayText;
			opacity: 1;
		}
	}

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

	:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: 3px;
	}
	.bref-surface {
		--surface-hover: 0%;
		--surface-neutral-strength: 0%;
		--surface-soft-strength: 5%;
		--surface-border: transparent;
		--surface-base: var(--crystal-code-panel);
		--surface-neutral-content: var(--crystal-code-bright);
		transition: color 100ms ease;
	}
	.bref-surface:is(:active, [data-surface-pressed='true']) {
		--surface-hover: 0%;
	}
	.bref-surface-soft {
		--surface-content: var(--surface-color);
	}
	.bref-surface-primary.bref-surface-soft {
		--surface-fill: var(--crystal-code-soft);
	}
	.bref-surface-primary.bref-surface-filled {
		--surface-content: var(--crystal-code-on-primary);
	}
	.bref-surface-background {
		--surface-content: var(--color-foreground);
	}
	.bref-surface-background.bref-surface-neutral {
		--surface-fill: var(--crystal-code-input);
	}
	.bref-surface-background.bref-surface-soft {
		--surface-fill: var(--crystal-code-well);
	}
	.bref-surface[data-shadow] {
		--surface-shadow: var(--crystal-code-widget-shadow);
	}
	div.bref-surface[data-color][data-size] {
		border-radius: var(--crystal-code-radius);
		--pill-choice-hover: 0%;
	}
	.bref-surface-filled[data-removable] {
		--pill-delete-hover: var(--surface-content);
	}
	.bref-glass {
		--glass-blur: blur(32px);
		--glass-opacity: 78%;
		box-shadow: var(--crystal-code-widget-shadow);
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-glass {
			background: var(--crystal-code-panel);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (forced-colors: active) {
		.bref-surface {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
			box-shadow: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-glass {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
			box-shadow: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		:focus-visible {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none;
			transition: none;
		}
	}
</style>
