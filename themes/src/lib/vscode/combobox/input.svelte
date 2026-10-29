<script lang="ts">
	import { createAttachmentKey } from 'svelte/attachments';
	import TextInput from '../text-input/text-input.svelte';
	import type { ComboboxInputProps } from 'bref-ui/types';

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

<div data-combobox-input data-size={size} data-wide={wide || undefined}>
	<TextInput
		{...native}
		{...attachment}
		{id}
		{placeholder}
		{disabled}
		{size}
		{variant}
		{wide}
		icon={!editing && selected.length === 1 ? selected[0].icon : undefined}
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

	<span data-chevron aria-hidden="true">
		<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
			<path
				d="M3.146 5.854 7.646 10.354a.5.5 0 0 0 .707 0l4.5-4.5a.5.5 0 0 0-.707-.707L8 9.293 3.854 5.147a.5.5 0 0 0-.708.707Z"
			/>
		</svg>
	</span>
</div>

<style>
	[data-combobox-input] {
		position: relative;
		display: inline-flex;
		align-self: start;
		width: min(100%, 18rem);
		min-width: 0;
		max-width: 100%;
	}
	[data-wide] {
		width: 100%;
	}
	/* Override only the nested field; standalone TextInput keeps its own styling. */
	[data-combobox-input] > :global(.bref-surface[data-size]:has(> input)) {
		--internal-height: 26px;
		--internal-icon-size: 16px;
		width: 100%;
		min-height: var(--internal-height);
		padding-inline: 6px 24px;
		gap: 6px;
		border-radius: 4px;
	}
	[data-combobox-input][data-size='small'] > :global(.bref-surface[data-size]:has(> input)) {
		--internal-height: 22px;
	}
	[data-combobox-input][data-size='large'] > :global(.bref-surface[data-size]:has(> input)) {
		--internal-height: 30px;
	}
	[data-combobox-input] > :global(.bref-surface:has(> input:focus)) {
		outline: 1px solid var(--color-primary);
		outline-offset: -1px;
	}
	[data-combobox-input]
		> :global(.bref-surface:has(> input[aria-invalid='true'], > input:user-invalid)) {
		outline-color: var(--color-error);
	}
	[data-combobox-input] > :global(.bref-surface > input) {
		font-size: 13px;
		font-weight: 400;
		line-height: 18px;
	}
	[data-combobox-input] :global(input::placeholder) {
		color: var(--color-muted);
	}
	[data-chevron] {
		position: absolute;
		inset-inline-end: 5px;
		top: 50%;
		display: flex;
		transform: translateY(-50%);
		color: var(--color-foreground);
		pointer-events: none;
	}
	[data-combobox-input]:has(:global(input:disabled)) [data-chevron] {
		opacity: 0.5;
	}
	@media (pointer: coarse) {
		[data-combobox-input] > :global(.bref-surface[data-size]:has(> input)) {
			min-height: 44px;
		}
	}
	@media (forced-colors: active) {
		[data-combobox-input] > :global(.bref-surface:has(> input:focus)) {
			outline-color: Highlight;
		}
		[data-chevron] {
			color: CanvasText;
		}
	}
</style>
