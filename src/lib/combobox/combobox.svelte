<script lang="ts">
	import Popover from '../popover/popover.svelte';
	import Input from './input.svelte';
	import List from './list.svelte';
	import Form from './form.svelte';
	import type { ComboboxProps } from './types.js';

	const generatedId = $props.id();
	let {
		items,
		value = $bindable(),
		onChange,
		id = generatedId,
		placeholder = 'Select…',
		size = 'medium',
		disabled = false,
		wide = false,
		variant = 'soft',
		emptyMessage = { message: 'No options found' },
		...attributes
	}: ComboboxProps = $props();
	const listId = `${generatedId}-options`;
	const initialValue = Array.isArray(value) ? [...value] : value;
	let query = $state('');
	let editing = $state(false);
	let open = $state(false);
	let activeId = $state<string>();
	let input = $state<HTMLInputElement>();
	const selectedIds = $derived(Array.isArray(value) ? value : value === undefined ? [] : [value]);
	const multiple = $derived(Array.isArray(value));
	const selected = $derived(items.filter((item) => selectedIds.includes(item.id)));
	const results = $derived(
		editing
			? items.filter((item) =>
					item.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
				)
			: items
	);
	const display = $derived(editing ? query : selected.map((item) => item.label).join(', '));

	const cancel = () => {
		open = false;
		query = '';
		editing = false;
		activeId = undefined;
	};
	$effect(() => {
		if (!open || disabled || attributes.readonly) cancel();
	});
	$effect(() => {
		if (activeId && !results.some((item) => item.id === activeId && !item.disabled))
			activeId = undefined;
	});
	const search = (next: string) => {
		if (disabled || attributes.readonly) return;
		query = next;
		editing = true;
		activeId = undefined;
		open = true;
	};
	const commit = (id: string) => {
		if (
			disabled ||
			attributes.readonly ||
			!results.some((item) => item.id === id && !item.disabled)
		)
			return;
		const next = multiple
			? selectedIds.includes(id)
				? selectedIds.filter((selectedId) => selectedId !== id)
				: [...selectedIds, id]
			: id;
		if (Array.isArray(next) || next !== value) {
			value = next;
			onChange?.(next);
		}
		if (!multiple) cancel();
		input?.focus({ preventScroll: true });
	};
	const reset = () => {
		value = Array.isArray(initialValue) ? [...initialValue] : initialValue;
		cancel();
	};
</script>

<div
	onfocusout={(event) => {
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) cancel();
	}}
>
	<Popover bind:open variant="filled" spacing="medium" radius="small" shadow scroll>
		{#snippet trigger()}
			<Input
				{attributes}
				{id}
				{placeholder}
				{size}
				{disabled}
				{wide}
				{variant}
				{display}
				{selected}
				{editing}
				{results}
				{listId}
				bind:open
				bind:activeId
				bind:input
				onSearch={search}
				onSelect={commit}
				onCancel={cancel}
			/>
		{/snippet}
		<List
			id={listId}
			items={results}
			{selectedIds}
			{activeId}
			{multiple}
			{size}
			{emptyMessage}
			aria-label={attributes['aria-label']}
			aria-labelledby={attributes['aria-labelledby']}
			onSelect={commit}
		/>
	</Popover>
	<Form
		{items}
		{selectedIds}
		{value}
		{multiple}
		{disabled}
		{placeholder}
		{input}
		{display}
		name={attributes.name}
		form={attributes.form}
		required={attributes.required}
		onReset={reset}
	/>
</div>

<style>
	div {
		display: contents;
	}
</style>
