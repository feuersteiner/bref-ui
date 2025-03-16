<script lang="ts">
	import type { Snippet } from 'svelte';
	import Footer from './footer/footer.svelte';
	import Navbar from './navbar/navbar.svelte';
	import type { ILayoutProps } from './types.js';
	import '$lib/layout/global-layout.css';

	const {
		children,
		navbar,
		footer
	}: ILayoutProps & {
		children: Snippet;
	} = $props();
</script>

{#if navbar}
	<Navbar {...navbar} />
{/if}
<main>
	{@render children()}
</main>
{#if footer}
	<Footer {...footer} />
{/if}

<style>
	main {
		all: unset;
		width: 100vw;
		height: fit-content;
		min-height: 100vh;
		background-color: var(--color-primary-background, #eee);
	}
</style>
