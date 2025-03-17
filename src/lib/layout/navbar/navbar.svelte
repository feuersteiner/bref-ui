<script lang="ts">
	import type { INavbarProps } from '../types.js';
	import MobileNavbar from './mobile-navbar.svelte';
	import DesktopNavbar from './desktop-navbar.svelte';

	const props: INavbarProps = $props();

	const themeColor = props.themeColor;
	const hasThemeColor =
		themeColor !== undefined &&
		RegExp(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6})$/i).test(themeColor);
</script>

<svelte:head>
	{#if hasThemeColor}
		<meta name="theme-color" content={themeColor} />
	{/if}
</svelte:head>

<nav class="navbar" class:isBackgroundColorSecondary={props.isBackgroundColorSecondary}>
	<div class="mobile">
		<MobileNavbar {...props} />
	</div>
	<div class="desktop">
		<DesktopNavbar {...props} />
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
	.desktop {
		display: flex;
	}
	.mobile {
		display: none;
	}
	@media (max-width: 720px) {
		.desktop {
			display: none;
		}
		.mobile {
			display: flex;
		}
	}
</style>
