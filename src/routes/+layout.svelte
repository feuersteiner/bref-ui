<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { ThemeMode } from '$lib/types.js';
	import Layout from './components/layout/docs-layout.svelte';
	import { Theme } from '$lib/index.js';
	import '@fontsource-variable/syne';
	import '@fontsource-variable/inter';

	let { children }: { children: Snippet } = $props();
	const theme = $state<{ mode: ThemeMode }>({ mode: 'light' });
	setContext('documentation-theme', theme);
</script>

<Theme><Layout>{@render children()}</Layout></Theme>

<style>
	:global(:root) {
		--grid: 24px;
		--font-display: 'Syne Variable', 'Syne', sans-serif;
		--font-text: 'Inter Variable', 'Inter', sans-serif;
		--docs-rule-strong: color-mix(in srgb, var(--color-foreground) 20%, transparent);
		--docs-rule: color-mix(in srgb, var(--color-foreground) 12%, transparent);
		--docs-rule-subtle: color-mix(in srgb, var(--color-foreground) 7%, transparent);
		--docs-surface: color-mix(in srgb, var(--color-foreground) 4%, transparent);
		--docs-code-background: color-mix(in srgb, var(--color-foreground) 7%, transparent);
	}
	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: calc(var(--grid) * 4);
	}
	:global(body) {
		font: 400 16px / 24px var(--font-text);
		font-synthesis: none;
	}
	:global(h1),
	:global(h2),
	:global(h3) {
		font-family: var(--font-display);
		font-weight: 700;
	}
	:global(h1) {
		font-size: clamp(48px, 7vw, 96px);
		line-height: 1;
	}
	:global(h2) {
		font-size: 48px;
		line-height: 48px;
	}
	:global(h3) {
		font-size: 24px;
		line-height: 24px;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}
	}
	@media (max-width: 575px) {
		:global(h2) {
			font-size: 24px;
			line-height: 24px;
		}
	}
</style>
