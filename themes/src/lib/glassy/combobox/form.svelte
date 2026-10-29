<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { ComboboxFormProps } from 'bref-ui/types';

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

<style>
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
