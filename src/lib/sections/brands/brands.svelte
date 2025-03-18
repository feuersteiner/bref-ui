<script lang="ts">
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBrandsProps } from './types.js';

	const {
		anchor,
		title,
		subtitle,
		primaryButton,
		secondaryButton,
		items,
		isBackgroundColorSecondary
	}: IBrandsProps = $props();
</script>

<SectionContainer {anchor} className="brands" {isBackgroundColorSecondary}>
	<SectionHeader {title} {subtitle} {primaryButton} {secondaryButton} />
	<SubSectionContainer gridSize="full">
		<div>
			{#each items as item}
				<a {...item.link} class="brands-item">
					<Media {...item.logo} type="image" fill className="brands-media" />
				</a>
			{/each}
		</div>
	</SubSectionContainer>
</SectionContainer>

<style>
	a {
		display: flex;
		width: 96px;
		aspect-ratio: 16 / 9;
		height: auto;
	}
	div {
		gap: 1rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
</style>
