<script lang="ts">
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBreadcrumbProps } from '../types.js';

	const { items }: IBreadcrumbProps = $props();
</script>

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
