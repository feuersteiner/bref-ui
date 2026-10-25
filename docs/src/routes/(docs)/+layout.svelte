<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { ThemeMode, ThemeProps } from 'bref-ui/types';
	import Layout from './components/layout/docs-layout.svelte';
	import { Theme } from 'bref-ui';
	import '@fontsource-variable/syne';
	import '@fontsource-variable/inter';

	let { children }: { children: Snippet } = $props();
	const theme = $state<{ mode: ThemeMode; palette: NonNullable<ThemeProps['palette']> }>({
		mode: 'light',
		palette: {}
	});
	setContext('documentation-theme', theme);
</script>

<div data-docs-root>
	<Theme palette={theme.palette}><Layout>{@render children()}</Layout></Theme>
</div>

<style>
	[data-docs-root] {
		display: contents;
		--grid: 24px;
		--font-display: 'Syne Variable', 'Syne', sans-serif;
		--font-text: 'Inter Variable', 'Inter', sans-serif;
		--docs-rule-strong: color-mix(in srgb, var(--color-foreground) 10%, transparent);
		--docs-rule: color-mix(in srgb, var(--color-foreground) 6%, transparent);
		--docs-rule-subtle: color-mix(in srgb, var(--color-foreground) 4%, transparent);
		--docs-surface: color-mix(in srgb, var(--color-foreground) 4%, transparent);
		--docs-code-background: color-mix(in srgb, var(--color-foreground) 7%, transparent);
	}
	:global(html:has([data-docs-root])) {
		scroll-behavior: smooth;
		scroll-padding-top: 96px;
	}
	[data-docs-root] {
		font: 400 16px / 24px var(--font-text);
		font-synthesis: none;
	}
	:global([data-docs-root] h1),
	:global([data-docs-root] h2),
	:global([data-docs-root] h3) {
		font-family: var(--font-display);
		font-weight: 400;
	}
	:global([data-docs-root] h1) {
		font-weight: 700;
		font-size: clamp(36px, 5vw, 64px);
		line-height: 1.05;
	}
	:global([data-docs-root] h2) {
		font-size: clamp(28px, 3vw, 36px);
		line-height: 1.2;
	}
	:global([data-docs-root] h3) {
		font-size: 24px;
		line-height: 24px;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(html:has([data-docs-root])) {
			scroll-behavior: auto;
		}
	}
	@media (max-width: 575px) {
		:global([data-docs-root] h2) {
			font-size: 24px;
			line-height: 24px;
		}
	}
</style>
