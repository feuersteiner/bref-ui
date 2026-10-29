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
		gap: 0.125rem;
		min-width: 0;
	}

	:focus-visible:not(input):not(textarea) {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::after {
			transition: none;
			animation: none;
		}
	}
	@media (forced-colors: active) {
		:focus-visible:not(input):not(textarea) {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none;
			transition: none;
		}
	}
</style>
