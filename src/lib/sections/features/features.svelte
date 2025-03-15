<script lang="ts">
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import SubSectionSubtitle from '$lib/shared/sub-section/sub-section-subtitle.svelte';
	import SubSectionTitle from '$lib/shared/sub-section/sub-section-title.svelte';
	import type { IFeaturesProps } from './type.js';

	const {
		title,
		subtitle,
		anchor,
		primaryButton,
		secondaryButton,
		items,
		isBackgroundColorSecondary
	}: IFeaturesProps = $props();
</script>

<SectionContainer {anchor} className="features" {isBackgroundColorSecondary}>
	<SectionHeader {title} {subtitle} {primaryButton} {secondaryButton} />
	{#each items as item}
		<SubSectionContainer itemsCount={items.length} className="features-item" justifyUp>
			<div class="feature-media">
				<Media {...item.media} fill className="feature-media" />
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
