<script lang="ts">
	import ButtonRow from '$lib/shared/button/button-row.svelte';
	import Logo from '$lib/shared/logo.svelte';
	import type { INavbarProps } from '../types.js';

	const { items, primaryButton, secondaryButton, logo }: INavbarProps = $props();
</script>

<div class="desktop-navbar">
	<Logo {...logo} size={logo.size ?? 'large'} />

	<div class="links">
		{#each items as item}
			<a href={item.href}>{item.label}</a>
		{/each}
	</div>

	<ButtonRow snug {primaryButton} {secondaryButton} size="medium" />
</div>

<style>
	div {
		display: flex;
		width: 100%;
		gap: 2rem;
	}
	.desktop-navbar {
		justify-content: space-between;
		align-items: center;
		height: fit-content;
	}
	.links {
		align-items: center;
		justify-content: center;
	}
</style>
