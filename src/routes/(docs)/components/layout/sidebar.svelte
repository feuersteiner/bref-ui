<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { TreeView } from '$lib/index.js';
	import SidebarNode from './sidebar-node.svelte';
	import { navigation, pageSections } from './navigation.js';

	let groups = $derived(
		navigation.map((group) => ({
			...group,
			items: [...group.links]
				.sort((a, b) => a.title.localeCompare(b.title, 'en'))
				.map((link) => ({ id: resolve(link.href), label: link.title }))
		}))
	);
</script>

<nav aria-label="Documentation">
	{#each groups as group (group.title)}
		<section aria-label={group.title}>
			<h2>{group.title}</h2>
			<TreeView items={group.items} label={group.title}>
				{#snippet node(item)}
					<SidebarNode
						{item}
						current={item.id === page.url.pathname}
						sections={item.id === page.url.pathname
							? (pageSections[page.route.id ?? ''] ?? [])
							: []}
					/>
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
