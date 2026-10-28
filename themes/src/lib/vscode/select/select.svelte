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

<div class="select" data-size={size}>
	<Popover bind:open spacing={undefined} radius="0.5rem" width="fill" shadow scroll {disabled}>
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
		--internal-height: 26px;
		--internal-row-height: 22px;
		--internal-padding: 8px;
		--internal-icon-size: 16px;
		position: relative;
		width: 100%;
		min-width: 0;
	}
	div[data-size='small'] {
		--internal-height: 22px;
		--internal-row-height: 20px;
	}
	div[data-size='large'] {
		--internal-height: 30px;
		--internal-row-height: 24px;
	}

	/* Keep dropdown geometry local to this theme component. */
	.select :global([popover]) {
		margin-block: 0;
	}
	.select :global([data-overlay]) {
		padding: 0;
		border-radius: 8px;
		background: var(--color-background);
	}
	@media (forced-colors: active) {
		.select :global([data-overlay]) {
			background: Canvas;
		}
	}
</style>
