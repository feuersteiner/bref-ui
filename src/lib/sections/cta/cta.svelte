<script lang="ts">
	import ButtonRow from '$lib/shared/button/button-row.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionSubtitle from '$lib/shared/section/section-subtitle.svelte';
	import SectionTitle from '$lib/shared/section/section-title.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBaseSectionProps } from '$lib/shared/types.js';

	const { title, subtitle, primaryButton, secondaryButton, anchor, isBackgroundColorSecondary }: IBaseSectionProps = $props();
</script>

<SectionContainer {anchor} className="cta" {isBackgroundColorSecondary}>
	<SubSectionContainer gridSize="full" gapSize="large">
		<SectionTitle {title} />
		<SectionSubtitle {subtitle} />
		<ButtonRow {primaryButton} {secondaryButton} size={'large'} />
	</SubSectionContainer>
</SectionContainer>
