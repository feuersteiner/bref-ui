<script lang="ts">
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import SubSectionSubtitle from '$lib/shared/sub-section/sub-section-subtitle.svelte';
	import SubSectionTitle from '$lib/shared/sub-section/sub-section-title.svelte';
	import type { IFeatureSectionProps } from './type.js';

	const {
		title,
		subtitle,
		anchor,
		primaryButton,
		secondaryButton,
		items,
		gridSize
	}: IFeatureSectionProps = $props();
</script>

<SectionContainer {anchor}>
	<SectionHeader {title} {subtitle} {primaryButton} {secondaryButton} />
	{#each items as item}
		<SubSectionContainer {gridSize}>
			<div class="feature-media">
				<Media {...item.media} fill />
			</div>
			<SubSectionTitle title={item.title} />
			<SubSectionSubtitle subtitle={item.subtitle} />
		</SubSectionContainer>
	{/each}
</SectionContainer>

<style>
	.feature-media {
		max-width: 50%;
		aspect-ratio: 1 / 1;
		height: auto;
	}
</style>
