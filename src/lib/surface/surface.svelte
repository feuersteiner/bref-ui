<script lang="ts">
	/* eslint-disable max-lines -- Keep the scoped Surface recipe and its scales together. */
	import type { Size, SurfaceProps } from '../types.js';

	let {
		as = 'div',
		children,
		tint = 'background',
		variant = 'neutral',
		spacing,
		orientation = 'vertical',
		width = 'fill',
		height = 'fit',
		radius,
		shadow = false,
		hover,
		scroll = false
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
	data-surface
	data-variant={variant}
	data-spacing={spacing}
	data-orientation={orientation}
	data-width={width}
	data-height={height}
	data-shadow={shadow || undefined}
	data-hover={hover}
	data-scroll={scroll || undefined}
	tabindex={scroll ? 0 : undefined}
	style:--surface-tint={`var(--color-${tint}, var(--color-background, white))`}
	style:--surface-radius={borderRadius}
>
	{@render children?.()}
</svelte:element>

<style>
	[data-surface] {
		--surface-spacing: 0;
		--surface-strength: 0%;
		--surface-border-strength: 0%;
		--surface-hover: 0%;
		--surface-glow: 0;
		--surface-shadow: 0 0 0 transparent;
		--surface-highlight: 0 0 0 transparent;
		--surface-background: var(--color-background, white);
		--surface-foreground: var(--color-foreground, black);
		box-sizing: border-box;
		flex-direction: column;
		width: 100%;
		height: auto;
		min-width: 0;
		min-height: 0;
		padding: var(--surface-spacing);
		gap: var(--surface-spacing);
		border: 0 solid transparent;
		border-radius: var(--surface-radius, 0);
		background: transparent;
		color: inherit;
		overflow: visible;
		box-shadow: var(--surface-shadow), var(--surface-highlight);
		transition:
			background-color 150ms ease,
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	[data-surface] {
		display: flex;
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
	[data-variant='soft'],
	[data-variant='filled'] {
		--surface-border-strength: 16%;
		--surface-highlight: inset 0 1px 0
			color-mix(in srgb, var(--surface-foreground) 14%, transparent);
		border-width: 1px;
		border-color: color-mix(
			in srgb,
			var(--surface-foreground) var(--surface-border-strength),
			transparent
		);
		background: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-strength),
			var(--surface-background)
		);
	}
	[data-variant='soft'] {
		--surface-strength: 6%;
		background: color-mix(
			in srgb,
			color-mix(in srgb, var(--surface-tint) var(--surface-strength), var(--surface-background)) 85%,
			transparent
		);
		-webkit-backdrop-filter: blur(1rem);
		backdrop-filter: blur(1rem);
	}
	[data-variant='filled'] {
		--surface-strength: 11%;
	}
	[data-shadow] {
		--surface-shadow: 0 0.5rem 1.5rem color-mix(in srgb, var(--surface-foreground) 12%, transparent);
	}
	[data-hover='small'] {
		--surface-hover: 2%;
		--surface-glow: 0.5rem;
	}
	[data-hover='medium'] {
		--surface-hover: 4%;
		--surface-glow: 1rem;
	}
	[data-hover='large'] {
		--surface-hover: 8%;
		--surface-glow: 1.5rem;
	}
	[data-hover]:is(:hover, :focus-visible) {
		--surface-border-strength: calc(16% + var(--surface-hover));
		box-shadow:
			var(--surface-shadow),
			var(--surface-highlight),
			0 0 var(--surface-glow) color-mix(in srgb, var(--surface-tint) 10%, transparent);
	}
	[data-variant='neutral'][data-hover]:is(:hover, :focus-visible) {
		background: color-mix(in srgb, var(--surface-tint) var(--surface-hover), transparent);
	}
	[data-variant='soft'][data-hover]:is(:hover, :focus-visible) {
		--surface-strength: calc(6% + var(--surface-hover));
	}
	[data-variant='filled'][data-hover]:is(:hover, :focus-visible) {
		--surface-strength: calc(11% + var(--surface-hover));
	}
	[data-scroll] {
		overflow: auto;
	}
	[data-surface]:focus-visible {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		[data-surface] {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		[data-surface] {
			box-shadow: none;
		}
		[data-variant='soft'],
		[data-variant='filled'] {
			background: Canvas;
			border-color: CanvasText;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		[data-surface][data-hover]:is(:hover, :focus-visible) {
			background: Canvas;
			box-shadow: none;
		}
		[data-surface]:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
