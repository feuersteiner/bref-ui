<script lang="ts">
	import type { PillGroupContainerProps } from './types.ts';

	let { items, renderItem, size = 'medium', ...attributes }: PillGroupContainerProps = $props();
</script>

<ul {...attributes} data-size={size}>
	{#each items as item (item.id)}
		<li>{@render renderItem(item)}</li>
	{/each}
</ul>

<style>
	ul {
		--pill-group-gap: 0.5rem;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: var(--pill-group-gap);
		margin: 0;
		padding: 0;
	}
	ul[data-size='x-small'] {
		--pill-group-gap: 0.25rem;
	}
	ul[data-size='small'] {
		--pill-group-gap: 0.375rem;
	}
	ul[data-size='large'] {
		--pill-group-gap: 0.75rem;
	}
	ul[data-size='x-large'] {
		--pill-group-gap: 1rem;
	}
	li {
		display: inline-flex;
		max-width: 100%;
		min-width: 0;
	}
</style>
