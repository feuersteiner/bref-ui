<script lang="ts">
	import ButtonRow from '$lib/shared/button/button-row.svelte';
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionSubtitle from '$lib/shared/section/section-subtitle.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import HeroTitle from './hero-title.svelte';
	import type { IMediaHeroProps } from './types.js';

	const { title, subtitle, primaryButton, secondaryButton, anchor, media }: IMediaHeroProps =
		$props();
</script>

<SectionContainer {anchor}>
	<SubSectionContainer gridSize="half" gapSize="large">
		<HeroTitle {title} align="left" />
		<SectionSubtitle {subtitle} align="left" />
		<ButtonRow {primaryButton} {secondaryButton} size={'large'} align="left" />
	</SubSectionContainer>
	<SubSectionContainer gridSize="half" gapSize="large">
		<Media {...media} />
	</SubSectionContainer>
</SectionContainer>
