<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { ComboboxFormProps } from './types.js';

	let {
		items,
		selectedIds,
		value,
		name,
		form,
		required,
		disabled,
		multiple,
		placeholder,
		input,
		display,
		onReset
	}: ComboboxFormProps = $props();
	let select: HTMLSelectElement;
	onMount(() => {
		const owner = select.form;
		const timers = new SvelteSet<ReturnType<typeof setTimeout>>();
		const reset = (event: Event) => {
			const timer = setTimeout(async () => {
				timers.delete(timer);
				if (!event.defaultPrevented) onReset();
				await tick();
				if (input) input.value = display;
			}, 0);
			timers.add(timer);
		};
		owner?.addEventListener('reset', reset);
		return () => {
			for (const timer of timers) clearTimeout(timer);
			owner?.removeEventListener('reset', reset);
		};
	});
</script>

<select
	bind:this={select}
	hidden
	{name}
	{form}
	{required}
	{disabled}
	{multiple}
	tabindex={-1}
	oninvalid={(event) => {
		event.preventDefault();
		input?.focus();
	}}
>
	{#if !multiple}<option value="" selected={value === undefined}>{placeholder}</option>{/if}
	{#each items as item (item.id)}
		<option value={item.id} selected={selectedIds.includes(item.id)} disabled={item.disabled}>
			{item.label}
		</option>
	{/each}
</select>
