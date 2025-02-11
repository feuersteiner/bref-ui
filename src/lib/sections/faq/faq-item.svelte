<script lang="ts">
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import SubSectionSubtitle from '$lib/shared/sub-section/sub-section-subtitle.svelte';
	import SubSectionTitle from '$lib/shared/sub-section/sub-section-title.svelte';
	import type { IFaqPairProps } from './types.js';

	const { question, answer }: IFaqPairProps = $props();
	let isOpen = $state(false);
	const toggle = () => (isOpen = !isOpen);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<SubSectionContainer>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div onclick={toggle}>
		<SubSectionTitle title={question} align="left" />
		<svg
			width="24"
			height="24"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class:isOpen
		>
			<path
				d="M2 4L6 8L10 4"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>
	{#if isOpen}
		<SubSectionSubtitle align="left" subtitle={answer} />
	{/if}
</SubSectionContainer>

<style>
	div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		cursor: pointer;
	}

	svg {
		cursor: inherit;
		rotate: 0deg;
		transition: rotate 0.15s;
		margin: 0.5rem;
	}
	.isOpen {
		rotate: 180deg;
	}
</style>
