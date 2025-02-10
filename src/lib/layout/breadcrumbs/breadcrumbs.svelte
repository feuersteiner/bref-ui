<script lang="ts">
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBreadcrumbProps } from '../types.js';

	const { items }: IBreadcrumbProps = $props();
	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.label,
			...(index < items.length - 1 && { item: item.href })
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<SectionContainer minimalPadding>
	<SubSectionContainer align="left">
		<div>
			{#each items as item, index}
				{#if index === items.length - 1}
					<strong>
						<span>{item.label}</span>
					</strong>
				{:else}
					<a href={item.href}>{item.label}</a>
					<span> / </span>
				{/if}
			{/each}
		</div>
	</SubSectionContainer>
</SectionContainer>

<style>
	div {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
