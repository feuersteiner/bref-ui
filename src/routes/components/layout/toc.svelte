<script lang="ts">
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import NavigationLink from './navigation-link.svelte';
	import type { PageSection } from './navigation.js';

	let { sections }: { sections: readonly PageSection[] } = $props();
	let sectionLinks = $derived(
		sections.map((section) => ({
			...section,
			isCurrent: page.url.hash === `#${section.id}`
		}))
	);
</script>

{#if sectionLinks.length}
	<nav aria-label="On this page">
		<ul>
			{#each sectionLinks as section (section.id)}
				<li in:fly={{ x: -24, duration: 240 }}>
					<NavigationLink
						href={`#${section.id}`}
						title={section.title}
						current={section.isCurrent ? 'location' : undefined}
					/>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	nav {
		--navigation-link-current-color: var(--color-secondary);
		--navigation-link-current-indent: 36px;
		--navigation-link-font: 500 12px / 24px var(--font-text);
		--navigation-link-min-height: 36px;
		padding-left: 48px;
	}
	ul {
		border-block: 1px solid var(--docs-rule-subtle);
		list-style: none;
	}
	li + li {
		border-top: 1px solid var(--docs-rule-subtle);
	}
</style>
