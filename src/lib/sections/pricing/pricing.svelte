<script lang="ts">
	import Button from '$lib/shared/button/button.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import SubSectionTitle from '$lib/shared/sub-section/sub-section-title.svelte';
	import type { IPricingProps } from './types.js';

	const {
		anchor,
		title,
		subtitle,
		primaryButton,
		secondaryButton,
		items,
		isBackgroundColorSecondary
	}: IPricingProps = $props();
</script>

<SectionContainer {anchor} className="pricing" {isBackgroundColorSecondary}>
	<SectionHeader {title} {subtitle} {primaryButton} {secondaryButton} />
	{#each items as item}
		<SubSectionContainer itemsCount={items.length} className="pricing-item">
			<SubSectionTitle title={item.title} />
			<span>{item.price}</span>
			<ul>
				{#each item.features as feature}
					<li>{feature}</li>
				{/each}
			</ul>
			<Button fullWidth {...item.ctaButton} type={item.featured ? 'primary' : 'default'} />
		</SubSectionContainer>
	{/each}
</SectionContainer>

<style>
	ul,
	li {
		margin: 0;
		padding: 0;
	}
	span {
		font-size: 1.25rem;
		font-weight: bold;
		text-transform: capitalize;
	}
</style>
