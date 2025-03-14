<script lang="ts">
	import type { Snippet } from 'svelte';
	import Footer from './footer/footer.svelte';
	import Navbar from './navbar/navbar.svelte';
	import type { ILayoutProps } from './types.js';
	import '$lib/layout/global-layout.css';

	const {
		children,
		navbar,
		footer,
		themeColor
	}: ILayoutProps & {
		children: Snippet;
	} = $props();

	const hasThemeColor =
		themeColor !== undefined &&
		RegExp(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6})$/i).test(themeColor);
</script>

<svelte:head>
	{#if hasThemeColor}
		<meta name="theme-color" content={themeColor} />
	{/if}
</svelte:head>

<Navbar {...navbar} />
<main>
	{@render children()}
</main>
<Footer {...footer} />

<style>
	main {
		all: unset;
		width: 100vw;
		height: fit-content;
		min-height: 100vh;
		background-color: var(--color-primary-background, #eee);
	}
</style>
