<script lang="ts">
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IBaseBlogPostProps } from '../types.js';

	const { title, subtitle, thumbnail, href, datePublished }: IBaseBlogPostProps = $props();
</script>

<SubSectionContainer gridSize="quarter" align="left" gapSize="small">
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<a {href}><img {...thumbnail} /></a>
	<a {href}><h3>{title}</h3></a>
	<p>{subtitle}</p>
	<span>{datePublished.toLocaleString()}</span>
</SubSectionContainer>

<style>
	img {
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		cursor: pointer;
		object-fit: cover;
	}
	a,
	h3,
	p,
	span {
		all: unset;
		text-align: left;
	}
	a {
		display: flex;
		width: 100%;
		height: fit-content;
	}
	h3 {
		font-size: 1.5rem;
		font-weight: bold;
		cursor: pointer;
	}
	p {
		font-size: 1rem;
	}
	span {
		font-size: 0.75rem;
	}
</style>
