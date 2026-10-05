<script lang="ts">
	import type { TreeItemProps } from '$lib/types.js';
	import NavigationLink from './navigation-link.svelte';
	import Toc from './toc.svelte';
	import type { PageSection } from './navigation.js';

	let {
		item,
		current,
		sections
	}: {
		item: TreeItemProps;
		current: boolean;
		sections: readonly PageSection[];
	} = $props();
</script>

<NavigationLink href={item.id} title={item.label} current={current ? 'page' : undefined} />
{#if current && sections.length}
	<Toc {sections} />
{/if}
