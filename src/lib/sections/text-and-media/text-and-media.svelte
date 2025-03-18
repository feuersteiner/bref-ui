<script lang="ts">
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import SubSectionSubtitle from '$lib/shared/sub-section/sub-section-subtitle.svelte';
	import SubSectionTitle from '$lib/shared/sub-section/sub-section-title.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import type { ITextAndMediaProps } from './types.js';

	const {
		title,
		subtitle,
		primaryButton,
		secondaryButton,
		items,
		anchor,
		isBackgroundColorSecondary
	}: ITextAndMediaProps = $props();

	const isLargeScreen: boolean = $derived(
		innerWidth.current === undefined || innerWidth.current > 768
	);

	const gapSize = 'small';
	const gridSize = 'half';
</script>

<SectionContainer {anchor} className="text-and-media" {isBackgroundColorSecondary}>
	<SectionHeader {title} {primaryButton} {secondaryButton} {subtitle} />
	{#each items as { title, subtitle, media }, index}
		{@const isMediaFirst = isLargeScreen && index % 2 === 1}
		{@const groupIndexNumber = index * 2}
		{@const textOrder = groupIndexNumber + Number(isMediaFirst)}
		{@const mediaOrder = groupIndexNumber + Number(!isMediaFirst)}
		<SubSectionContainer {gridSize} {gapSize} className="text-and-media-item" order={textOrder}>
			<SubSectionTitle align="left" {title} />
			<SubSectionSubtitle align="left" {subtitle} />
		</SubSectionContainer>
		<SubSectionContainer {gridSize} {gapSize} className="text-and-media-media" order={mediaOrder}>
			<Media {...media} />
		</SubSectionContainer>
	{/each}
</SectionContainer>
