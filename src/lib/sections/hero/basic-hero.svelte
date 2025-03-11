<script lang="ts">
	import ButtonRow from '$lib/shared/button/button-row.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionSubtitle from '$lib/shared/section/section-subtitle.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBaseSectionProps } from '$lib/shared/types.js';
	import HeroTitle from './hero-title.svelte';

	const { title, subtitle, primaryButton, secondaryButton, anchor }: IBaseSectionProps = $props();
</script>

<SectionContainer {anchor} className="basic-hero">
	<SubSectionContainer gridSize="full" gapSize="large">
		<HeroTitle {title} />
		<SectionSubtitle {subtitle} />
		<ButtonRow {primaryButton} {secondaryButton} size={'large'} />
	</SubSectionContainer>
</SectionContainer>
