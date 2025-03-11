<script lang="ts">
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBrandsProps } from './types.js';

	const { anchor, title, subtitle, primaryButton, secondaryButton, items }: IBrandsProps = $props();
</script>

<SectionContainer {anchor} className="brands">
	<SectionHeader {title} {subtitle} {primaryButton} {secondaryButton} />
	{#each items as item}
		<SubSectionContainer itemsCount={items.length} className="brands-item">
			<a {...item.link}>
				<Media {...item.logo} type="image" fill className="brands-media" />
			</a>
		</SubSectionContainer>
	{/each}
</SectionContainer>

<style>
	a {
		display: flex;
		width: 100%;
		aspect-ratio: 16 / 9;
		height: auto;
	}
</style>
