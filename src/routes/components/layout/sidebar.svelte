<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Toc from './toc.svelte';
	import NavigationLink from './navigation-link.svelte';
	import { navigation, pageSections } from './navigation.js';

	let groups = $derived(
		navigation.map((group) => ({
			...group,
			links: group.links.map((link) => {
				const path = resolve(link.href);

				return { ...link, path, isCurrent: path === page.url.pathname };
			})
		}))
	);
</script>

<nav aria-label="Documentation">
	{#each groups as group (group.title)}
		<section aria-label={group.title}>
			<h2>{group.title}</h2>
			<ul>
				{#each group.links as link (link.href)}
					<li>
						<NavigationLink
							href={link.path}
							title={link.title}
							current={link.isCurrent ? 'page' : undefined}
						/>
						{#if link.isCurrent}
							<Toc sections={pageSections[page.route.id ?? ''] ?? []} />
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</nav>

<style>
	nav {
		display: grid;
		gap: 48px;
	}
	h2 {
		margin-bottom: 24px;
		color: var(--color-secondary);
		font: 700 12px / 24px var(--font-display);
		text-transform: uppercase;
		opacity: 0.75;
	}
	ul {
		list-style: none;
	}
</style>
