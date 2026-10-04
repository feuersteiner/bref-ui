<script lang="ts">
	import Trigger from './trigger.svelte';
	import List from './list.svelte';
	import type { SelectProps } from './types.js';

	const componentId = $props.id();
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
	const panelId = `${componentId}-options`;
	const selected = $derived(
		items.filter((item) => (Array.isArray(value) ? value.includes(item.id) : item.id === value))
	);
	const select = (id: string) => {
		if (Array.isArray(value))
			value = value.includes(id) ? value.filter((selectedId) => selectedId !== id) : [...value, id];
		else {
			if (value === id) return;
			value = id;
		}
		onChange?.(value);
	};
</script>

<div data-size={size} style={`--internal-anchor: --select-${componentId}`}>
	<Trigger {id} {panelId} {selected} {placeholder} {disabled} />
	{#if !disabled}
		<List id={panelId} {items} {value} {emptyMessage} onSelect={select} />
	{/if}
</div>

<style>
	div {
		--internal-height: 2.5rem;
		--internal-padding: 0.85rem;
		--internal-icon-size: 1.25rem;
		anchor-name: var(--internal-anchor);
		position: relative;
		width: 100%;
		min-width: 0;
	}
	div[data-size='small'] {
		--internal-height: 2rem;
		--internal-padding: 0.65rem;
		--internal-icon-size: 1rem;
	}
	div[data-size='large'] {
		--internal-height: 3rem;
		--internal-padding: 1rem;
		--internal-icon-size: 1.5rem;
	}
</style>
