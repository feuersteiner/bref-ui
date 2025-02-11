<script lang="ts">
	import MediaHero from '$lib/sections/hero/media-hero.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBlogPostProps } from './types.js';

	const { title, subtitle, content, keywords, thumbnail, href, datePublished }: IBlogPostProps =
		$props();
</script>

<MediaHero {title} {subtitle} media={{ ...thumbnail, type: 'image' }} />
<SectionContainer>
	<SubSectionContainer gridSize="full" align="left">
		<div>
			{@html content}
		</div>
	</SubSectionContainer>
</SectionContainer>

<style>
	div {
		display: flex;
        flex-direction: column;
		width: 100%;
		height: fit-content;
		white-space: pre-line;
	}
</style>
