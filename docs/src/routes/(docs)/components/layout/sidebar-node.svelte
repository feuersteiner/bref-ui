<script lang="ts">
	import NavigationLink from './navigation-link.svelte';
	import Toc from './toc.svelte';
	import type { NavigationItem } from './navigation.js';

	let { item, currentPath }: { item: NavigationItem; currentPath: string } = $props();
</script>

{#snippet node(item: NavigationItem)}
	<NavigationLink
		href={item.id}
		title={item.label}
		current={item.id === currentPath ? 'page' : undefined}
	/>
	{#if item.id === currentPath && item.sections?.length}
		<Toc sections={item.sections} />
	{/if}
	{#if item.children?.length}
		<ul>
			{#each item.children as child (child.id)}
				<li>{@render node(child)}</li>
			{/each}
		</ul>
	{/if}
{/snippet}

{@render node(item)}

<style>
	ul {
		padding-left: 16px;
		list-style: none;
	}
</style>
