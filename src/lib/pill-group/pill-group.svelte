<script lang="ts">
	import Pill from '../pill/pill.svelte';
	import type { PillGroupProps } from './types.js';

	let {
		items,
		color = 'foreground',
		size = 'medium',
		variant = 'neutral',
		renderItem,
		ref = $bindable(),
		...attributes
	}: PillGroupProps = $props();
</script>

<ul bind:this={ref} {...attributes} data-size={size}>
	{#each items as item (item.id)}
		<li>
			{#if renderItem}
				{@render renderItem(item)}
			{:else}
				<Pill {color} {size} {variant}>{item.label}</Pill>
			{/if}
		</li>
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
