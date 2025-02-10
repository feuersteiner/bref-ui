<script lang="ts">
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import FaqItem from './faq-item.svelte';
	import type { IFaqProps } from './types.js';

	const { items, title, subtitle, anchor, primaryButton, secondaryButton }: IFaqProps =
		$props();

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => {
			return {
				'@type': 'Question',
				name: item.question,
				acceptedAnswer: {
					'@type': 'Answer',
					text: item.answer
				}
			};
		})
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<SectionContainer {anchor}>
	<SectionHeader {title} {primaryButton} {secondaryButton} {subtitle} />
	{#each items as item}
		<FaqItem {...item} />
	{/each}
</SectionContainer>
