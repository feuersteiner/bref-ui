<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { TreeView } from 'bref-ui';
	import SidebarNode from './sidebar-node.svelte';
	import {
		navigation,
		pageSections,
		type NavigationItem,
		type NavigationPage
	} from './navigation.js';

	const navigationItem = (link: NavigationPage): NavigationItem => {
		return {
			id: link.href === '' ? resolve('') : resolve(link.href),
			label: link.title,
			sections: pageSections[`/${link.href}`] ?? [],
			children: link.children?.map(navigationItem)
		};
	};

	let groups = $derived(
		navigation.map((group) => ({
			...group,
			items: ('sort' in group && group.sort === false
				? [...group.links]
				: [...group.links].sort((a, b) => a.title.localeCompare(b.title, 'en'))
			).map(navigationItem)
		}))
	);
</script>

<nav aria-label="Documentation">
	{#each groups as group (group.title)}
		<section aria-label={group.title}>
			<h2>{group.title}</h2>
			<TreeView items={group.items} label={group.title}>
				{#snippet node(item)}
					<SidebarNode {item} currentPath={page.url.pathname} />
				{/snippet}
			</TreeView>
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
</style>
