<script lang="ts">
	import ButtonRow from '../button/button-row.svelte';
	import SubSectionContainer from '../sub-section/sub-section-container.svelte';
	import type { IBaseSectionProps } from '../types.js';
	import SectionSubtitle from './section-subtitle.svelte';
	import SectionTitle from './section-title.svelte';

	const { title, subtitle, primaryButton, secondaryButton }: IBaseSectionProps = $props();
</script>

<SubSectionContainer gridSize="full" gapSize="medium">
	<SectionTitle {title} />
	<SectionSubtitle {subtitle} />
	<ButtonRow {primaryButton} {secondaryButton} size={'medium'} />
</SubSectionContainer>
