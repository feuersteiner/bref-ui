<script lang="ts">
	import Logo from '$lib/shared/logo.svelte';
	import SectionContainer from '$lib/shared/section/section-container.svelte';
	import SubSectionContainer from '$lib/shared/sub-section/sub-section-container.svelte';
	import type { IFooterProps } from '../types.js';

	const { columns, logo, copyright, tagline, isBackgroundColorSecondary }: IFooterProps = $props();
	const itemsCount = columns.length + 1 > 4 ? 4 : columns.length + 1;
</script>

<footer>
	<SectionContainer className="footer" {isBackgroundColorSecondary}>
		<SubSectionContainer {itemsCount} gapSize="medium" align="left" justifyUp className="footer-item">
			<Logo size="large" {...logo} />
			<p class="tagline">{tagline}</p>
		</SubSectionContainer>
		{#each columns as column}
			<SubSectionContainer {itemsCount} gapSize="medium" align="left" justifyUp className="footer-item">
				<strong><a {...column.header}>{column.header.label}</a></strong>
				{#if column.children}
					{#each column.children as child}
						<a {...child}>{child.label}</a>
					{/each}
				{/if}
			</SubSectionContainer>
		{/each}
		<SubSectionContainer gridSize="full" gapSize="medium">
			<p>© {new Date().getFullYear()} All rights reserved {copyright}.</p>
		</SubSectionContainer>
	</SectionContainer>
</footer>

<style>
	footer {
		all: unset;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: fit-content;
		min-height: fit-content;
	}
</style>
