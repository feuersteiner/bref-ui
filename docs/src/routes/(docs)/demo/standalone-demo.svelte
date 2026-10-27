<script lang="ts">
	import { resolve } from '$app/paths';
	import { Theme, ThemeModeToggle } from 'bref-ui';
	import type { Snippet } from 'svelte';
	import '@fontsource-variable/inter';
	import { palettes, type SitePalette } from './palettes.js';

	let { palette, children }: { palette: SitePalette; children: Snippet } = $props();
	let footerHeight = $state(57);
</script>

<Theme palette={palettes[palette]}>
	<ThemeModeToggle mode="light" />
	<div data-standalone-demo style:--demo-footer-height={`${footerHeight}px`}>
		<main id="content" tabindex="-1">{@render children()}</main>
		<footer bind:offsetHeight={footerHeight}>
			<a href={resolve('demo')}>Back to Bref docs</a>
		</footer>
	</div>
</Theme>

<style>
	[data-standalone-demo] {
		--font-display: 'Inter Variable', sans-serif;
		--font-text: 'Inter Variable', sans-serif;
		container: demo / inline-size;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--color-background);
		color: var(--color-foreground);
		font: 400 14px/1.6 var(--font-text);
		font-synthesis: none;
	}
	main {
		flex: 1;
		min-width: 0;
	}
	footer {
		padding: 16px 24px;
		border-top: 1px solid color-mix(in srgb, var(--color-foreground) 12%, transparent);
	}
	a {
		color: var(--color-primary);
		text-underline-offset: 4px;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
</style>
