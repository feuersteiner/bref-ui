<script lang="ts">
	import { onMount } from 'svelte';
	import Pill from '../pill/pill.svelte';
	import PillGroup from '../pill-group/pill-group.svelte';
	import type { PillGroupItem } from '../pill-group/types.js';
	import type { PillChoiceGroupProps } from './types.js';

	let {
		items,
		label,
		selection = 'single',
		selectedIds = $bindable([]),
		name,
		disabled = false,
		size = 'medium',
		variant = 'neutral',
		ref = $bindable(),
		...attributes
	}: PillChoiceGroupProps = $props();

	const generatedName = $props.id();
	let singleSelectedId = $derived(items.find((item) => selectedIds.includes(item.id))?.id);

	$effect(() => {
		if (selection !== 'single') return;
		const first = items.find((item) => selectedIds.includes(item.id))?.id;
		if (selectedIds.length !== (first ? 1 : 0) || selectedIds[0] !== first)
			selectedIds = first ? [first] : [];
	});

	onMount(() => {
		const initialSelectedIds = [...selectedIds];
		const form = ref?.closest('form');
		if (!form) return;
		let timer: ReturnType<typeof setTimeout>;
		const reset = (event: Event) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				if (event.defaultPrevented) return;
				selectedIds = [...initialSelectedIds];
				ref?.querySelectorAll('input').forEach((input) => {
					input.checked = initialSelectedIds.includes(input.value);
				});
			}, 0);
		};
		form.addEventListener('reset', reset);
		return () => {
			clearTimeout(timer);
			form.removeEventListener('reset', reset);
		};
	});

	const select = (id: string, checked: boolean) => {
		if (disabled) return;
		if (selection === 'single') selectedIds = [id];
		else
			selectedIds = checked
				? [...selectedIds.filter((selected) => selected !== id), id]
				: selectedIds.filter((selected) => selected !== id);
	};
</script>

{#snippet renderItem(item: PillGroupItem)}
	{@const selected =
		selection === 'single' ? singleSelectedId === item.id : selectedIds.includes(item.id)}
	<label data-disabled={disabled || undefined}>
		<input
			type={selection === 'single' ? 'radio' : 'checkbox'}
			name={name ?? (selection === 'single' ? generatedName : undefined)}
			value={item.id}
			checked={selected}
			{disabled}
			onchange={(event) => select(item.id, event.currentTarget.checked)}
		/>
		<Pill
			color={selected ? 'primary' : 'foreground'}
			variant={selected ? 'filled' : variant}
			{size}
		>
			{item.label}
		</Pill>
	</label>
{/snippet}

<PillGroup
	{...attributes}
	{items}
	{size}
	{variant}
	{renderItem}
	role={selection === 'single' ? 'radiogroup' : 'group'}
	aria-label={label}
	bind:ref
/>

<style>
	label {
		position: relative;
		display: inline-flex;
		max-width: 100%;
		min-height: 2.75rem;
		cursor: pointer;
	}
	input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: inherit;
	}
	label:has(input:focus-visible) {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
		border-radius: 999px;
	}
	label[data-disabled] {
		opacity: 0.45;
		cursor: not-allowed;
	}
	@media (forced-colors: active) {
		label:has(input:checked) {
			outline: 2px solid Highlight;
			border-radius: 999px;
		}
	}
</style>
