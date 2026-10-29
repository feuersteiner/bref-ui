<script lang="ts">
	import Popover from '../popover/popover.svelte';
	import Trigger from './trigger.svelte';
	import List from './list.svelte';
	import type { SelectProps } from 'bref-ui/types';

	let {
		id,
		items,
		value = $bindable(),
		onChange,
		placeholder = 'Select…',
		size = 'medium',
		disabled = false,
		emptyMessage = { message: 'No options found' }
	}: SelectProps = $props();

	let open = $state(false);
	const selected = $derived(
		items.filter((item) => (Array.isArray(value) ? value.includes(item.id) : item.id === value))
	);
	const select = (id: string) => {
		if (Array.isArray(value))
			value = value.includes(id) ? value.filter((selectedId) => selectedId !== id) : [...value, id];
		else {
			open = false;
			if (value === id) return;
			value = id;
		}
		onChange?.(value);
	};
</script>

<div data-size={size}>
	<Popover bind:open spacing="x-small" radius="0.75rem" width="fill" shadow scroll {disabled}>
		{#snippet trigger()}
			<Trigger
				{id}
				{open}
				{selected}
				{placeholder}
				{disabled}
				{size}
				onToggle={() => (open = !open)}
			/>
		{/snippet}
		<List {items} {value} {emptyMessage} onSelect={select} />
	</Popover>
</div>

<style>
	div {
		--internal-height: 2.5rem;
		--internal-row-height: 2.125rem;
		--internal-padding: 1rem;
		--internal-icon-size: 1.25rem;
		position: relative;
		width: 100%;
		min-width: 0;
	}
	div[data-size='small'] {
		--internal-height: 2rem;
		--internal-row-height: 1.875rem;
		--internal-padding: 0.75rem;
		--internal-icon-size: 1rem;
	}
	div[data-size='large'] {
		--internal-height: 3rem;
		--internal-row-height: 2.375rem;
		--internal-padding: 1.125rem;
		--internal-icon-size: 1.5rem;
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
