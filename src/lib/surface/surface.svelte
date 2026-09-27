<script lang="ts">
	import { SURFACE_STYLING_SCALE_VALUES, type SurfaceProps } from './types.js';

	let {
		children,
		stylesOverride,
		height = 'fit',
		orientation = 'vertical',
		radius,
		spacing,
		tint,
		variant = 'neutral',
		width = 'fill',
		shadow = false,
		hoverEffect
	}: SurfaceProps = $props();

	const borderRadius = $derived(radius ? SURFACE_STYLING_SCALE_VALUES.radius[radius] : undefined);
	const tintColor = $derived(`var(--color-${tint ?? 'foreground'})`);
	const hoverStrength = $derived(
		hoverEffect ? SURFACE_STYLING_SCALE_VALUES.hover[hoverEffect] : undefined
	);
	const hoverGlow = $derived(
		hoverEffect ? SURFACE_STYLING_SCALE_VALUES.glow[hoverEffect] : undefined
	);
</script>

<div
	{...stylesOverride}
	class:fit-width={width === 'fit'}
	class:fill-height={height === 'fill'}
	class={[variant, orientation]}
	class:shadow
	style:padding={spacing ? SURFACE_STYLING_SCALE_VALUES.spacing[spacing] : undefined}
	style:gap={spacing ? SURFACE_STYLING_SCALE_VALUES.spacing[spacing] : undefined}
	style:--surface-radius={borderRadius}
	style:--surface-tint={tintColor}
	style:--surface-hover={hoverStrength}
	style:--surface-hover-glow={hoverGlow}
>
	{@render children?.()}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-width: 0;
		color: inherit;
		overflow: hidden;
		--surface-bg: 0%;
		--surface-border: 0%;
		--surface-shadow: 0 0 0 transparent;
		--surface-highlight: 0 0 0 transparent;
		border-radius: var(--surface-radius, 0);
		box-shadow: var(--surface-shadow);
		transition: all 0.25s ease;
	}

	.horizontal {
		flex-direction: row;
		align-items: center;
	}

	.fit-width {
		width: fit-content;
	}

	.fill-height {
		height: 100%;
	}

	.soft,
	.filled {
		border: 1px solid color-mix(in srgb, var(--surface-tint) var(--surface-border), transparent);
		-webkit-backdrop-filter: blur(1rem);
		backdrop-filter: blur(1rem);
		--surface-highlight: inset 0 1px 0 color-mix(in srgb, var(--surface-tint) 14%, transparent);
	}

	.soft {
		--surface-bg: 6%;
		--surface-border: 16%;
		background: color-mix(in srgb, var(--surface-tint) var(--surface-bg), transparent);
	}

	.filled {
		--surface-bg: 11%;
		--surface-border: 16%;
		background: color-mix(in srgb, var(--surface-tint) var(--surface-bg), transparent);
	}

	.shadow {
		--surface-shadow: 0 0 1rem color-mix(in srgb, var(--color-foreground) 3%, transparent);
	}

	div:hover {
		background: color-mix(
			in srgb,
			var(--surface-tint) calc(var(--surface-bg) + var(--surface-hover, 0%)),
			transparent
		);
		border-color: color-mix(
			in srgb,
			var(--surface-tint) calc(var(--surface-border) + var(--surface-hover, 0%)),
			transparent
		);
		box-shadow:
			var(--surface-shadow),
			var(--surface-highlight),
			0 0 var(--surface-hover-glow, 0) color-mix(in srgb, var(--surface-tint) 10%, transparent);
	}

	@media (forced-colors: active) {
		.soft,
		.filled {
			background: Canvas;
			border-color: CanvasText;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}

		div,
		div:hover {
			box-shadow: none;
		}
	}
</style>
