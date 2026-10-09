<script lang="ts">
	import { tick } from 'svelte';
	import Icon from '../icon/icon.svelte';
	import Option from './option.svelte';
	import type { ComboboxListProps } from './types.js';

	let {
		id,
		items,
		selectedIds,
		activeId,
		multiple,
		size,
		emptyMessage,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		onSelect
	}: ComboboxListProps = $props();
	let list: HTMLDivElement;
	$effect(() => {
		const index = items.findIndex((item) => item.id === activeId);
		if (index >= 0)
			void tick().then(() =>
				list
					?.querySelector(`#${CSS.escape(`${id}-${index}`)}`)
					?.scrollIntoView({ block: 'nearest' })
			);
	});
</script>

<div
	bind:this={list}
	{id}
	role="listbox"
	data-size={size}
	aria-multiselectable={multiple || undefined}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledby}
>
	{#each items as item, index (item.id)}
		<Option
			id={`${id}-${index}`}
			{item}
			selected={selectedIds.includes(item.id)}
			active={item.id === activeId}
			onSelect={() => onSelect(item.id)}
		/>
	{:else}
		<p>
			{#if emptyMessage.icon}<Icon {...emptyMessage.icon} />{/if}{emptyMessage.message}
		</p>
	{/each}
</div>

<style>
	div {
		--internal-row-height: 2.125rem;
		--internal-icon-size: 1.25rem;
		display: grid;
		gap: 0.125rem;
	}
	div[data-size='small'] {
		--internal-row-height: 1.875rem;
		--internal-icon-size: 1rem;
	}
	div[data-size='large'] {
		--internal-row-height: 2.375rem;
		--internal-icon-size: 1.5rem;
	}
	p {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		padding: 0.5rem;
		color: var(--color-muted);
	}
</style>
