<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ISectionContainerProps } from '../types.js';

	const {
		children,
		anchor,
		minimalPadding
	}: {
		children: Snippet;
	} & ISectionContainerProps = $props();
</script>

<section class:minimalPadding>
	<div id={anchor}>
		{@render children()}
	</div>
</section>

<style>
	section {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 4rem 0rem;
	}
	.minimalPadding {
		padding: 0rem;
	}

	div {
		width: 100%;
		max-width: var(--max-section-width, 1200px);
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		column-gap: 2rem;
		row-gap: 4rem;
	}
</style>
