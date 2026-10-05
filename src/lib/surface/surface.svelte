<script lang="ts">
	import type { Size, SurfaceProps } from '../types.js';
	import { surface } from '../theme/surface.js';

	let {
		as = 'div',
		children,
		color = 'background',
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
	class={surface({ variant, color, shadow, hover })}
	data-variant={variant}
	data-spacing={spacing}
	data-orientation={orientation}
	data-width={width}
	data-height={height}
	data-shadow={shadow || undefined}
	data-hover={hover}
	data-scroll={scroll || undefined}
	tabindex={scroll ? 0 : undefined}
	style:--surface-radius={borderRadius}
>
	{@render children?.()}
</svelte:element>

<style>
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
</style>
