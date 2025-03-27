<script lang="ts">
	import type { IPageSeoProps } from './types.js';

	const { title, description, keywords, thumbnail, path, baseUrl, jsonLd }: IPageSeoProps =
		$props();

	const url = baseUrl + path;
	const JSON_LD = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		additionalType: jsonLd.additionalType,
		name: jsonLd.name,
		legalName: jsonLd.legalName,
		url,
		logo: jsonLd.logo,
		contactPoint: [
			{
				'@type': 'ContactPoint',
				url: baseUrl,
				contactType: 'Customer Support'
			}
		],
		sameAs: jsonLd.socialMedia
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:site_name" content={jsonLd.name} />
	<meta property="og:title" content={title} />
	<meta property="og:image" content={thumbnail} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
	{@html `<script type="application/ld+json">${JSON_LD}</script>`}
	<meta name="keywords" content={keywords.join(', ')} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href={url} />
</svelte:head>
