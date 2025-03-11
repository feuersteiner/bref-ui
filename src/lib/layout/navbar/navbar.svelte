<script lang="ts">
	import type { INavbarProps } from '../types.js';
	import MobileNavbar from './mobile-navbar.svelte';
	import DesktopNavbar from './desktop-navbar.svelte';

	const props: INavbarProps = $props();

	let isMobileMenu: boolean = $state(false);
	const onresize = (e: Event) => {
		const newValue = window.innerWidth < 640 ? true : false;
		if (isMobileMenu !== newValue) isMobileMenu = newValue;
	};
</script>

<svelte:document {onresize} />
<nav class="navbar" class:isBackgroundColorSecondary={props.isBackgroundColorSecondary}>
	<div>
		{#if isMobileMenu}
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
		height: fit-content;
		background-color: var(--color-primary-background, #eee);
	}
	
	.isBackgroundColorSecondary {
		background-color: var(--color-secondary-background, #aaa);
	}

	div {
		width: 100%;
		max-width: var(--section-max-width, 1200px);
		padding: 1rem;
		display: flex;
		height: fit-content;
	}
</style>
