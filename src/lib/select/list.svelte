<script lang="ts">
	import Option from './option.svelte';
	import Empty from './empty.svelte';
	import type { SelectListProps } from './types.js';

	let { items, value, emptyMessage, onSelect }: SelectListProps = $props();
</script>

<div>
	{#each items as item (item.id)}
		<Option
			{...item}
			selected={Array.isArray(value) ? value.includes(item.id) : value === item.id}
			onSelect={() => onSelect(item.id)}
		/>
	{:else}
		<Empty {...emptyMessage} />
	{/each}
</div>

<style>
	div {
		display: grid;
		gap: 0.125rem;
		min-width: 0;
	}
</style>
