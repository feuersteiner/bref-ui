<script lang="ts">
	import ButtonRow from '$lib/shared/button/button-row.svelte';
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionSubtitle from '$lib/shared/section/section-subtitle.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import HeroTitle from './hero-title.svelte';
	import type { IMediaHeroProps } from './types.js';

	const {
		title,
		subtitle,
		primaryButton,
		secondaryButton,
		anchor,
		media,
		isBackgroundColorSecondary,
		type = 'horizontal'
	}: IMediaHeroProps = $props();

	const gridSize = type === 'horizontal' ? 'half' : 'full';
	const align = type === 'horizontal' ? 'left' : 'center';
</script>

<SectionContainer {anchor} className="media-hero" {isBackgroundColorSecondary}>
	<SubSectionContainer {gridSize} gapSize="large">
		<HeroTitle {title} {align} />
		<SectionSubtitle {subtitle} {align} />
		<ButtonRow {primaryButton} {secondaryButton} size={'large'} {align} />
	</SubSectionContainer>
	<SubSectionContainer {gridSize} gapSize="large">
		<Media {...media} className="media-hero-media" />
	</SubSectionContainer>
</SectionContainer>
