<script lang="ts">
	import { page } from '$app/state';
	import { MediaQuery } from 'svelte/reactivity';
	import { fly } from 'svelte/transition';
	import NavigationLink from './navigation-link.svelte';
	import type { PageSection } from './navigation.js';

	let { sections }: { sections: readonly PageSection[] } = $props();
	let activeSection = $state('');
	const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)', false);
	let sectionLinks = $derived(
		sections.map((section) => ({
			...section,
			isCurrent: activeSection === section.id
		}))
	);

	$effect(() => {
		const url = page.url;
		const headings = sections
			.map((section) => document.getElementById(section.id))
			.filter((heading): heading is HTMLElement => heading !== null);
		activeSection = sections.find((section) => `#${section.id}` === url.hash)?.id ?? '';
		let frame = 0;

		const update = () => {
			frame = 0;
			const first = headings[0];
			if (!first) return;
			const offset =
				(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) +
				(parseFloat(getComputedStyle(first).scrollMarginTop) || 0);
			let current = first;
			for (const heading of headings)
				if (heading.getBoundingClientRect().top <= offset + 1) current = heading;

			// Short final sections cannot always reach the anchor offset.
			if (
				window.scrollY > 0 &&
				window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1
			)
				current = headings[headings.length - 1];

			activeSection = current.id;
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		const resizeObserver = new ResizeObserver(schedule);
		const content = document.getElementById('content');
		if (content) resizeObserver.observe(content);
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);
		schedule();

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
		};
	});
</script>

{#if sectionLinks.length}
	<nav aria-label="On this page">
		<ul>
			{#each sectionLinks as section (section.id)}
				<li in:fly={{ x: -24, duration: reducedMotion.current ? 0 : 240 }}>
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
