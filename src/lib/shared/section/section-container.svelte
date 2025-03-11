<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ISectionContainerProps } from '../types.js';

	const {
		children,
		anchor,
		minimalPadding,
		isBackgroundColorSecondary,
		className,
		gap = 'medium'
	}: {
		children: Snippet;
	} & ISectionContainerProps = $props();

	const sectionClassName = 'section' + (className ? ' ' + className : '');
	const rowGap = gap === 'small' ? '2rem' : gap === 'medium' ? '4rem' : '8rem';
</script>

<section class:minimalPadding class:isBackgroundColorSecondary class={sectionClassName}>
	<div id={anchor} style:row-gap={rowGap}>
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
		background-color: var(--color-primary-background, #eee);
	}
	.minimalPadding {
		padding: 0rem;
	}

	.isBackgroundColorSecondary {
		background-color: var(--color-secondary-background, #aaa);
	}

	div {
		width: 100%;
		max-width: var(--section-max-width, 1200px);
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		column-gap: 2rem;
	}
</style>
