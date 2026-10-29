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

	:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (forced-colors: active) {
		:focus-visible {
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
