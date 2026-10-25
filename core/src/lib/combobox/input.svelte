<script lang="ts">
	import { createAttachmentKey } from 'svelte/attachments';
	import TextInput from '../text-input/text-input.svelte';
	import type { ComboboxInputProps } from './types.js';

	let {
		attributes,
		id,
		placeholder,
		size,
		disabled,
		wide,
		variant,
		display,
		selected,
		editing,
		results,
		listId,
		open = $bindable(),
		activeId = $bindable(),
		input = $bindable(),
		onSearch,
		onSelect,
		onCancel
	}: ComboboxInputProps = $props();
	const attachmentKey = createAttachmentKey();
	const attachment = {
		[attachmentKey]: (element: HTMLInputElement) => {
			input = element;
			return () => {
				if (input === element) input = undefined;
			};
		}
	};
	const native = $derived({ ...attributes, name: undefined, form: undefined, required: undefined });
	const activeIndex = $derived(results.findIndex((item) => item.id === activeId && !item.disabled));
	let composing = false;
	let pointing = false;

	const show = () => {
		if (!disabled && !attributes.readonly) open = true;
	};
	const move = (step: number) => {
		const enabled = results.filter((item) => !item.disabled);
		if (!enabled.length) return;
		const index = enabled.findIndex((item) => item.id === activeId);
		activeId =
			enabled[
				index < 0
					? step > 0
						? 0
						: enabled.length - 1
					: (index + step + enabled.length) % enabled.length
			].id;
	};
	const keydown = (event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (!disabled && !attributes.readonly && !event.isComposing && !composing)
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				show();
				move(event.key === 'ArrowDown' ? 1 : -1);
			} else if ((event.key === 'Home' || event.key === 'End') && open) {
				event.preventDefault();
				const enabled = results.filter((item) => !item.disabled);
				activeId = enabled[event.key === 'Home' ? 0 : enabled.length - 1]?.id;
			} else if (event.key === 'Enter' && open && activeId) {
				event.preventDefault();
				onSelect(activeId);
			} else if (event.key === 'Escape' && (open || editing)) {
				event.preventDefault();
				onCancel();
			}

		attributes.onkeydown?.(event);
	};
</script>

<TextInput
	{...native}
	{...attachment}
	{id}
	{placeholder}
	{disabled}
	{size}
	{variant}
	{wide}
	icon={editing
		? undefined
		: selected.length === 1 && selected[0].icon
			? { ...selected[0].icon }
			: { name: 'unfold_more' }}
	value={display}
	role="combobox"
	aria-autocomplete="list"
	aria-haspopup="listbox"
	aria-controls={listId}
	aria-expanded={open}
	aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
	aria-required={attributes.required || undefined}
	onChange={onSearch}
	onkeydown={keydown}
	onpointerdown={() => (pointing = true)}
	onpointerup={() => (pointing = false)}
	onpointercancel={() => (pointing = false)}
	onfocus={(event) => {
		if (
			!pointing &&
			!(
				event.relatedTarget instanceof Node &&
				document.getElementById(listId)?.closest('[popover]')?.contains(event.relatedTarget)
			)
		)
			show();
		attributes.onfocus?.(event);
	}}
	onclick={(event) => {
		event.preventDefault();
		// Native light dismissal can precede the queued toggle update.
		open = false;
		show();
		attributes.onclick?.(event);
	}}
	onblur={attributes.onblur}
	oncompositionstart={(event) => {
		composing = true;
		attributes.oncompositionstart?.(event);
	}}
	oncompositionend={(event) => {
		composing = false;
		attributes.oncompositionend?.(event);
	}}
/>
