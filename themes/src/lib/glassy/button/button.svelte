<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import { surface } from '../theme/surface.js';
	import type { ButtonProps } from 'bref-ui/types';
	import type { HTMLButtonAttributes } from 'svelte/elements';

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
	const common = $derived({
		class: ['button', surface({ variant, color, glass, hover: 'medium' }), className],
		'aria-label': attributes['aria-label'] ?? (isIcon ? (icon?.label ?? icon?.name) : undefined),
		'data-color': color,
		'data-size': size,
		'data-variant': variant,
		'data-kind': isIcon ? 'icon' : 'normal',
		'data-wide': wide && !isIcon ? '' : undefined,
		'data-rounded': rounded && isIcon ? '' : undefined
	});
	const native = $derived(
		href !== undefined
			? {
					href: disabled ? undefined : href,
					'aria-disabled': disabled ? true : attributes['aria-disabled'],
					tabindex: disabled ? -1 : attributes.tabindex
				}
			: { type: (attributes as HTMLButtonAttributes).type ?? 'button', disabled }
	);
</script>

<svelte:element
	this={href !== undefined ? 'a' : 'button'}
	{...attributes}
	{...common}
	{...native}
	onclick={disabled && href !== undefined ? (event: MouseEvent) => event.preventDefault() : onClick}
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
	.bref-surface:is(button, a, [role='button']) {
		cursor: pointer;
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
	.bref-surface-hover-large {
		--surface-hover: 8%;
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

	.bref-surface:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:active,
			[data-surface-pressed='true']
		) {
		--surface-hover: 8%;
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

	.bref-surface {
		--surface-neutral-strength: 0%;
		--surface-soft-strength: 14%;
		--glassy-paint: color-mix(in srgb, var(--surface-tint) var(--surface-strength), #ffffff);
		--glassy-opacity: 40%;
		--surface-border: #ffffff80;
		--surface-highlight: inset 0 1px 0 #ffffffdd, inset 0 -1px 0 #24344210;
		--surface-shadow: 0 2px 6px #24344214;
		--glassy-ink: var(--surface-content);
	}
	.bref-surface-soft {
		--glassy-opacity: 56%;
		--surface-border: #ffffff99;
	}
	.bref-surface-filled {
		--glassy-paint: var(--surface-fill);
		--glassy-opacity: 100%;
		--surface-border: #ffffff22;
		--glassy-ink: #ffffff;
		--surface-highlight: inset 0 1px 0 #ffffff30;
	}
	.bref-surface-background {
		--surface-tint: var(--color-foreground);
		--surface-soft-strength: 4%;
		--glassy-ink: var(--color-foreground);
	}
	.bref-surface-background.bref-surface-filled {
		--surface-highlight: inset 0 1px 0 #ffffff;
	}
	.bref-surface {
		background: var(--glassy-paint, #f5f6f7);
		color: var(--glassy-ink, var(--color-foreground));
		box-shadow: var(--surface-highlight), var(--surface-shadow);
	}
	.bref-glass {
		background: var(--glassy-paint, #f5f6f7);
		color: var(--glassy-ink, var(--color-foreground));
		box-shadow: var(--surface-highlight), var(--surface-shadow);
	}
	[data-surface] {
		--surface-shadow: 0 12px 36px -16px #24344240;
	}
	.bref-surface-shadow-small {
		--surface-shadow: 0 4px 12px -4px #24344220;
	}
	.bref-surface-shadow-medium {
		--surface-shadow: 0 12px 32px -12px #24344230;
	}
	.bref-surface-shadow-large {
		--surface-shadow: 0 24px 64px -20px #24344238;
	}
	.button.button {
		border-radius: 999px;
		font-weight: 500;
	}
	.button:not(.bref-surface-filled)[aria-pressed='true'] {
		--glassy-paint: color-mix(in srgb, var(--color-primary) 16%, #ffffff);
		--glassy-ink: color-mix(in srgb, var(--color-primary) 80%, var(--color-foreground));
		--glassy-opacity: 82%;
		--surface-border: color-mix(in srgb, var(--color-primary) 24%, transparent);
	}
	@media (hover: hover) {
		.button.bref-surface-filled:not(:disabled, [aria-disabled='true']):hover {
			--glassy-paint: color-mix(in srgb, var(--surface-color) 88%, #20262e);
			filter: none;
		}
	}
	:focus-visible:not(input):not(textarea) {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.bref-surface {
			background:
				linear-gradient(135deg, #ffffff20, transparent 45%, #ffffff08),
				color-mix(in srgb, var(--glassy-paint, #f5f6f7) var(--glassy-opacity, 90%), transparent);
			-webkit-backdrop-filter: blur(32px) saturate(125%);
			backdrop-filter: blur(32px) saturate(125%);
		}
	}
	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.bref-glass {
			background:
				linear-gradient(135deg, #ffffff20, transparent 45%, #ffffff08),
				color-mix(in srgb, var(--glassy-paint, #f5f6f7) var(--glassy-opacity, 90%), transparent);
			-webkit-backdrop-filter: blur(32px) saturate(125%);
			backdrop-filter: blur(32px) saturate(125%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::after {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-surface {
			background: var(--glassy-paint, #f5f6f7);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-glass {
			background: var(--glassy-paint, #f5f6f7);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-surface {
			background: Canvas;
			color: CanvasText;
			border-color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-glass {
			background: Canvas;
			color: CanvasText;
			border-color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.button[aria-pressed='true'] {
			outline: 2px solid Highlight;
			outline-offset: -2px;
		}
	}
	@media (forced-colors: active) {
		.bref-surface:is(:disabled, [aria-disabled='true']) {
			color: GrayText;
		}
	}
	@media (forced-colors: active) {
		:focus-visible:not(input):not(textarea) {
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
