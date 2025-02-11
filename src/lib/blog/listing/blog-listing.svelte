<script lang="ts">
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SectionHeader from '$lib/shared/section/section-header.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBlogListingProps } from '../types.js';
	import BlogListingItem from './blog-listing-item.svelte';

	const { posts, title, subtitle }: IBlogListingProps = $props();
	let query: string = $state('');

	const onchange = (event: Event) => {
		query = (event.target as HTMLInputElement).value;
	};

	const filteredPosts = $derived(
		posts.filter((post) => query !== '' || post.title.toLowerCase().includes(query.toLowerCase()))
	);
</script>

<SectionContainer>
	<SectionHeader {title} {subtitle} />
	<SubSectionContainer gridSize="full">
		<div class="search-input">
			<input type="text" placeholder="Search..." {onchange} />
			<div class="search-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			</div>
		</div>
	</SubSectionContainer>
</SectionContainer>

<SectionContainer>
	{#each filteredPosts as post}
		<BlogListingItem {...post} />
	{/each}
</SectionContainer>

<style>
	div {
		display: flex;
		width: 100%;
		align-items: center;
	}
	.search-input {
		width: 100%;
		max-width: 640px;
		margin: 0;
	}
	input {
		all: unset;
		width: 100%;
		font-size: 1.5rem;
	}
	.search-icon {
		width: 2rem;
		min-width: 2rem;
		height: 2rem;
		min-height: 2rem;
		cursor: pointer;
		justify-content: center;
	}
</style>
