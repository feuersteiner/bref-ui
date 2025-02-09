<script lang="ts">
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import SubSectionSubtitle from '$lib/shared/sub-section/sub-section-subtitle.svelte';
	import SubSectionTitle from '$lib/shared/sub-section/sub-section-title.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import type { ITextAndMediaProps } from './types.js';

	const { title, subtitle, primaryButton, secondaryButton, items, anchor }: ITextAndMediaProps =
		$props();
	const small = $derived(innerWidth.current ? innerWidth.current < 640 : false);
	const gapSize = 'small';
</script>

<SectionContainer {anchor}>
	<SectionHeader {title} {primaryButton} {secondaryButton} {subtitle} />
	{#each items as { title, subtitle, media }, index}
		{@const isEven = index % 2 === 0}
		{#if isEven || small}
			<SubSectionContainer gridSize="half" {gapSize}>
				<SubSectionTitle align="left" {title} />
				<SubSectionSubtitle align="left" {subtitle} />
			</SubSectionContainer>
			<SubSectionContainer gridSize="half" {gapSize}>
				<Media {...media} />
			</SubSectionContainer>
		{:else}
			<SubSectionContainer gridSize="half" {gapSize}>
				<Media {...media} />
			</SubSectionContainer>
			<SubSectionContainer gridSize="half" {gapSize}>
				<SubSectionTitle align="left" {title} />
				<SubSectionSubtitle align="left" {subtitle} />
			</SubSectionContainer>
		{/if}
	{/each}
</SectionContainer>
