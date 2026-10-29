<script lang="ts">
	import { tick } from 'svelte';
	import Icon from '../icon/icon.svelte';
	import Option from './option.svelte';
	import type { ComboboxListProps } from 'bref-ui/types';

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
		--internal-row-height: 22px;
		--internal-icon-size: 16px;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0;
		min-width: 0;
		font-size: 13px;
		font-weight: 400;
		line-height: 18px;
	}
	div[data-size='small'] {
		--internal-row-height: 20px;
	}
	div[data-size='large'] {
		--internal-row-height: 24px;
	}
	p {
		display: flex;
		align-items: center;
		gap: 6px;
		margin: 0;
		padding: 4px 8px;
		color: var(--color-muted);
	}

	:focus-visible {
		outline-color: var(--color-primary);
		outline-offset: 2px;
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
