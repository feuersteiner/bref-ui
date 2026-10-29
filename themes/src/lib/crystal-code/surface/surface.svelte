<script lang="ts">
	import type { Size, SurfaceProps } from 'bref-ui/types';
	import { surface } from '../theme/surface.js';

	let {
		as = 'div',
		children,
		color = 'background',
		variant = 'neutral',
		glass = false,
		spacing,
		orientation = 'vertical',
		width = 'fill',
		height = 'fit',
		radius,
		shadow = false,
		hover,
		scroll = false,
		class: className,
		...attributes
	}: SurfaceProps = $props();

	const radiusScale: Record<Size, string> = {
		'x-small': '0.25rem',
		small: '0.5rem',
		medium: '1.5rem',
		large: '2.5rem',
		'x-large': '4rem'
	};
	const borderRadius = $derived(
		radius && radius in radiusScale ? radiusScale[radius as Size] : radius
	);
</script>

<svelte:element
	this={as}
	{...attributes}
	data-surface
	class={[surface({ variant, color, glass, shadow, hover }), className]}
	data-variant={variant}
	data-spacing={spacing}
	data-orientation={orientation}
	data-width={width}
	data-height={height}
	data-shadow={shadow || undefined}
	data-hover={hover}
	data-scroll={scroll || undefined}
	tabindex={attributes.tabindex ?? (scroll ? 0 : undefined)}
	style:--surface-radius={borderRadius}
>
	{@render children?.()}
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

	[data-surface] {
		--surface-spacing: 0;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		min-width: 0;
		min-height: 0;
		padding: var(--surface-spacing);
		gap: var(--surface-spacing);
		border-radius: var(--surface-radius, 0);
		overflow: visible;
	}
	[data-surface][data-surface-motion] {
		opacity: var(--surface-motion-opacity, 1);
		translate: 0 var(--surface-motion-offset, 0px);
		scale: var(--surface-motion-scale, 1);
	}
	[data-orientation='horizontal'] {
		flex-direction: row;
		align-items: center;
	}
	[data-width='fit'] {
		width: fit-content;
		max-width: 100%;
	}
	[data-height='fill'] {
		height: 100%;
	}
	[data-spacing='x-small'] {
		--surface-spacing: 0.25rem;
	}
	[data-spacing='small'] {
		--surface-spacing: 0.5rem;
	}
	[data-spacing='medium'] {
		--surface-spacing: 1rem;
	}
	[data-spacing='large'] {
		--surface-spacing: 1.5rem;
	}
	[data-spacing='x-large'] {
		--surface-spacing: 2rem;
	}
	[data-scroll] {
		overflow: auto;
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
	.bref-glass {
		--glass-blur: blur(32px);
		--glass-opacity: 78%;
		box-shadow: var(--crystal-code-widget-shadow);
	}
	[data-overlay].bref-surface {
		border-radius: 14px;
		background: var(--crystal-code-panel);
		color: var(--color-foreground);
		--color-muted: var(--crystal-code-overlay-muted);
		box-shadow:
			0 18px 70px #00000030,
			0 3px 12px #00000014;
	}
	@supports (backdrop-filter: blur(1px)) {
		[data-overlay].bref-surface {
			background: var(--crystal-code-overlay);
			-webkit-backdrop-filter: blur(32px);
			backdrop-filter: blur(32px);
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-glass,
		[data-overlay].bref-surface {
			background: var(--crystal-code-panel);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bref-surface,
		.bref-surface::before {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (forced-colors: active) {
		.bref-surface,
		.bref-glass,
		[data-overlay].bref-surface {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
</style>
