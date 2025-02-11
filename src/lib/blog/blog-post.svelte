<script lang="ts">
	import MediaHero from '$lib/sections/hero/media-hero.svelte';
	import PageSeo from '$lib/sections/seo/page-seo.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBlogPostProps } from './types.js';

	const {
		title,
		subtitle,
		content,
		keywords,
		thumbnail,
		href,
		datePublished,
		author,
		publisher,
		baseUrl
	}: IBlogPostProps = $props();

	const JSON_LD = JSON.stringify({
		'@context': 'http://schema.org/',
		author: { name: author.name, '@type': author.type },
		publisher: {
			...publisher,
			'@type': 'Organization'
		},
		thumbnailUrl: thumbnail.src,
		datePublished,
		dateModified: datePublished.toISOString(),
		headline: title,
		name: title,
		image: thumbnail.src,
		mainEntityOfPage: href,
		'@type': 'Article'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON_LD}</script>`}
</svelte:head>

<PageSeo
	{title}
	description={subtitle}
	{keywords}
	thumbnail={thumbnail.src}
	path={href}
	jsonLd={{
		additionalType: 'https://schema.org/Article',
		name: publisher.name,
		legalName: publisher.name,
		logo: publisher.logo.url,
		socialMedia: publisher.socialMedia
	}}
	{baseUrl}
/>

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
