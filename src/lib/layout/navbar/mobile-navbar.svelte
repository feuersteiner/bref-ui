<script lang="ts">
	import ButtonRow from '$lib/shared/button/button-row.svelte';
	import Logo from '$lib/shared/logo.svelte';
	import type { INavbarProps } from '../types.js';

	const { items, primaryCta, secondaryCta, logo }: INavbarProps = $props();
	let isOpen = $state(false);
	const toggle = () => (isOpen = !isOpen);
</script>

<div class="column">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div>
		<Logo {...logo} size="medium" />

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class:isOpen
			onclick={toggle}
		>
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	</div>

	{#if isOpen}
		<div class="column">
			{#each items as item}
				<a href={item.href}>
					{item.label}
				</a>
			{/each}
		</div>
		<ButtonRow primaryButton={primaryCta} secondaryButton={secondaryCta} size="small" />
	{/if}
</div>

<style>
	div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: fit-content;
		gap: 1rem;
	}
	svg {
		rotate: 0deg;
		transition: rotate 0.15s ease-in-out;
		cursor: pointer;
	}

	.isOpen {
		rotate: 90deg;
	}
	.column {
		flex-direction: column;
	}
</style>
