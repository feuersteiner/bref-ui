<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import { palettes, type SitePalette } from './palettes.js';

	let { children }: { children: Snippet } = $props();
	const activePalette = $derived(
		page.params.theme && page.params.theme in palettes
			? (page.params.theme as SitePalette)
			: undefined
	);
	const palette = $derived(activePalette ? palettes[activePalette] : undefined);
</script>

{#if palette}
	<div
		data-demo-preview
		data-theme="light"
		style:--color-primary={palette.primary}
		style:--color-secondary={palette.secondary}
		style:--color-background={palette.background}
		style:--color-foreground={palette.foreground}
		style:--color-muted={palette.muted}
		style:--color-success={palette.success}
	>
		{@render children()}
	</div>
{:else}
	{@render children()}
{/if}

<style>
	[data-demo-preview] {
		--color-info: var(--color-info-light);
		--color-warning: var(--color-warning-light);
		--color-error: var(--color-error-light);
		--font-display: 'Inter Variable', sans-serif;
		--font-text: 'Inter Variable', sans-serif;
		container: demo / inline-size;
		isolation: isolate;
		min-width: 0;
		background: var(--color-background);
		color: var(--color-foreground);
		font: 400 14px/1.6 var(--font-text);
		font-synthesis: none;
	}
</style>
