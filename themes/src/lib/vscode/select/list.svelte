<script lang="ts">
	import Option from './option.svelte';
	import Empty from './empty.svelte';
	import type { SelectListProps } from 'bref-ui/types';

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
		grid-template-columns: minmax(0, 1fr);
		gap: 0;
		font: inherit;
		font-size: 13px;
		font-weight: 400;
		line-height: 18px;
		min-width: 0;
	}
</style>
