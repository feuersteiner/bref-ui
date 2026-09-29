<script lang="ts">
	import type { PillProps } from './types.js';

	let {
		children,
		color = 'foreground',
		size = 'medium',
		variant = 'neutral',
		ref = $bindable(),
		...attributes
	}: PillProps = $props();
</script>

<span
	bind:this={ref}
	{...attributes}
	data-color={color}
	data-size={size}
	data-variant={variant}
	style:--pill-color={`var(--color-${color}, #28231f)`}
>
	{@render children?.()}
</span>

<style>
	span {
		--pill-background: color-mix(in srgb, var(--pill-color) 3%, transparent);
		--pill-border: color-mix(in srgb, var(--pill-color) 20%, transparent);
		--pill-content: var(--pill-color);
		--pill-padding: 1.125rem;
		--pill-height: 3rem;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		max-width: 100%;
		min-height: var(--pill-height);
		padding: 0.25rem var(--pill-padding);
		border: 1px solid var(--pill-border);
		border-radius: 999px;
		background: var(--pill-background);
		color: var(--pill-content);
		font: inherit;
		line-height: 1.25;
		text-align: center;
		white-space: normal;
		overflow-wrap: anywhere;
	}
	span[data-size='x-small'] {
		--pill-height: 1.75rem;
		--pill-padding: 0.5rem;
		font-size: 0.8rem;
	}
	span[data-size='small'] {
		--pill-height: 2.5rem;
		--pill-padding: 0.875rem;
	}
	span[data-size='large'] {
		--pill-height: 4rem;
		--pill-padding: 1.5rem;
		font-size: 1.25rem;
	}
	span[data-size='x-large'] {
		--pill-height: 5rem;
		--pill-padding: 2rem;
		font-size: 1.5rem;
	}
	span[data-variant='soft'] {
		--pill-background: color-mix(in srgb, var(--pill-color) 16%, var(--color-background, white));
		--pill-border: color-mix(in srgb, var(--pill-color) 30%, transparent);
		--pill-content: color-mix(in srgb, var(--pill-color) 80%, var(--color-foreground, black));
	}
	span[data-variant='filled'] {
		--pill-background: color-mix(in srgb, var(--pill-color) 88%, var(--color-foreground, black));
		--pill-border: color-mix(in srgb, var(--pill-color) 68%, var(--color-foreground, black));
		--pill-content: color-mix(in srgb, var(--color-background, white) 90%, var(--pill-color));
	}
	@media (forced-colors: active) {
		span {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
		}
	}
</style>
