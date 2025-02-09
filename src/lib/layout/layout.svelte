<script lang="ts">
	import type { Snippet } from 'svelte';
	import Footer from './footer/footer.svelte';
	import Navbar from './navbar/navbar.svelte';
	import type { ILayoutProps } from './types.js';
	import './global-layout.css';

	const {
		children,
		navbar,
		footer
	}: ILayoutProps & {
		children: Snippet;
	} = $props();
</script>

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
	}
</style>
