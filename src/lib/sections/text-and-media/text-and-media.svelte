<script lang="ts">
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import SubSectionSubtitle from '$lib/shared/sub-section/sub-section-subtitle.svelte';
	import SubSectionTitle from '$lib/shared/sub-section/sub-section-title.svelte';

	import type { ITextAndMediaProps } from './types.js';

	const { title, subtitle, primaryButton, secondaryButton, items, anchor }: ITextAndMediaProps =
		$props();

	let isSmall: boolean = $state(false);
	const onresize = (e: Event) => {
		const newValue = window.innerWidth < 640 ? false : true;
		if (isSmall !== newValue) isSmall = newValue;
	};

	const gapSize = 'small';
</script>

<svelte:document {onresize} />
<SectionContainer {anchor} className="text-and-media">
	<SectionHeader {title} {primaryButton} {secondaryButton} {subtitle} />
	{#each items as { title, subtitle, media }, index}
		{@const isEven = index % 2 === 0}
		{#if isEven || isSmall}
			<SubSectionContainer gridSize="half" {gapSize} className="text-and-media-item">
				<SubSectionTitle align="left" {title} />
				<SubSectionSubtitle align="left" {subtitle} />
			</SubSectionContainer>
			<SubSectionContainer gridSize="half" {gapSize}>
				<Media {...media} className="text-and-media-media" />
			</SubSectionContainer>
		{:else}
			<SubSectionContainer gridSize="half" {gapSize} className="text-and-media-item">
				<Media {...media} className="text-and-media-media" />
			</SubSectionContainer>
			<SubSectionContainer gridSize="half" {gapSize}>
				<SubSectionTitle align="left" {title} />
				<SubSectionSubtitle align="left" {subtitle} />
			</SubSectionContainer>
		{/if}
	{/each}
</SectionContainer>
