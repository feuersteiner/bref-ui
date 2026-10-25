<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { Theme, ThemeModeToggle } from 'bref-ui';
	import type { ThemeMode } from 'bref-ui/types';
	import type { Snippet } from 'svelte';
	import { palettes, type SitePalette } from './palettes.js';
	import DemoNav from './(sites)/demo-nav.svelte';
	import SiteHeader from './catalog/site-header.svelte';
	import './catalog/navigation.css';
	let { children }: { children: Snippet } = $props();
	let mode = $state<ThemeMode>('light');
	const activePalette = $derived(
		page.route.id?.includes('(todo)')
			? 'relay'
			: page.route.id?.includes('(house-shop)')
				? 'forma'
				: page.route.id?.includes('(runner-ai)')
					? 'elsewhere'
					: page.params.theme && page.params.theme in palettes
						? (page.params.theme as SitePalette)
						: undefined
	);
	const showcase = $derived(page.route.id === '/(skins)/skins');
	const contentId = $derived(
		showcase
			? 'showcase-content'
			: page.route.id?.includes('(themes)')
				? 'theme-content'
				: 'demo-content'
	);
	onNavigate((navigation) => {
		if (
			navigation.from?.url.pathname === navigation.to?.url.pathname ||
			!document.startViewTransition ||
			matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;
		return new Promise<void>((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<Theme palette={activePalette ? palettes[activePalette] : {}}>
	<ThemeModeToggle mode={activePalette ? 'light' : mode} />
	<div data-demo-root>
		<SiteHeader bind:mode {contentId}>
			{#if !showcase}<DemoNav />{/if}
		</SiteHeader>
		<div data-navigation-content>{@render children()}</div>
	</div>
</Theme>

<style>
	[data-demo-root] {
		font:
			400 14px/1.6 'Inter Variable',
			sans-serif;
		font-synthesis: none;
	}
</style>
