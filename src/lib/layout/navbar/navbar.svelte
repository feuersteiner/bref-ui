<script lang="ts">
	import type { INavbarProps } from '../types.js';
	import { innerWidth } from 'svelte/reactivity/window';
	import MobileNavbar from './mobile-navbar.svelte';
	import DesktopNavbar from './desktop-navbar.svelte';

	const props: INavbarProps = $props();
	const shouldShowMobileMenu = $derived(innerWidth.current ? innerWidth.current < 640 : true);
</script>

<nav>
	<div>
		{#if shouldShowMobileMenu}
			<MobileNavbar {...props} />
		{:else}
			<DesktopNavbar {...props} />
		{/if}
	</div>
</nav>

<style>
	nav {
		all: unset;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	div {
		width: 100%;
		max-width: var(--max-section-width, 1200px);
		padding: 1rem;
		display: flex;
	}
</style>
