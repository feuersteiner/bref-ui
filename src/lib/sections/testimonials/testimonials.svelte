<script lang="ts">
	import Media from '$lib/shared/media.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import SubSectionSubtitle from '$lib/shared/sub-section/sub-section-subtitle.svelte';
	import type { ITestimonialsProps } from './types.js';

	const {
		title,
		subtitle,
		primaryButton,
		secondaryButton,
		items,
		anchor,
		isBackgroundColorSecondary
	}: ITestimonialsProps = $props();

	const align = 'left';
</script>

<SectionContainer {anchor} className="testimonials" {isBackgroundColorSecondary}>
	<SectionHeader {title} {primaryButton} {secondaryButton} {subtitle} />
	{#each items as item}
		<SubSectionContainer
			gapSize="small"
			{align}
			itemsCount={items.length}
			className="testimonials-item"
			justifyUp
		>
			<span>“</span>
			<SubSectionSubtitle subtitle={item.text} {align} />
			<div>
				<div class="testimonial-media">
					{#if item.avatar}
						<Media {...item.avatar} fill className="testimonial-media" />
					{:else}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="testimonial-media"
						>
							<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" />
							<path
								d="M4 20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							/>
						</svg>
					{/if}
				</div>
				<div class="person">
					<h3>{item.person.name}</h3>
					<p>{item.person.company}</p>
				</div>
			</div>
		</SubSectionContainer>
	{/each}
</SectionContainer>

<style>
	div {
		display: flex;
		width: fit-content;
		height: fit-content;
		gap: 0.5rem;
		align-items: center;
		justify-content: center;
	}
	.testimonial-media {
		width: 2rem;
		height: 2rem;
	}
	.person {
		flex-direction: column;
		height: fit-content;
		align-items: flex-start;
		gap: 0rem;
	}
	h3,
	p,
	span {
		all: unset;
		text-align: left;
	}
	p {
		font-size: 0.75rem;
	}
	span {
		font-size: 2rem;
		opacity: 0.5;
	}
</style>
