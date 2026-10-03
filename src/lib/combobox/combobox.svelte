<script lang="ts">
	/* eslint-disable max-lines -- Search, selection, and native form state share one control. */
	import { onMount, tick } from 'svelte';
	import Input from '../input/input.svelte';
	import Icon from '../icon/icon.svelte';
	import Option from '../select/option.svelte';
	import type { ComboboxProps } from './types.js';

	const generatedId = $props.id();
	let {
		items,
		value = $bindable(),
		onChange,
		placeholder = 'Select…',
		size = 'medium',
		disabled = false,
		readonly = false,
		wide = false,
		variant = 'soft',
		emptyMessage = { message: 'No options found' },
		id = generatedId,
		name,
		form,
		required = false,
		oninput,
		onkeydown,
		onblur,
		onfocus,
		onclick,
		oncompositionstart,
		oncompositionend,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		'aria-describedby': ariaDescribedby,
		style: inputStyle,
		...attributes
	}: ComboboxProps = $props();

	const panelId = `${generatedId}-options`;
	const selectedIds = $derived(Array.isArray(value) ? value : value === undefined ? [] : [value]);
	const multiple = $derived(Array.isArray(value));
	const selected = $derived(items.filter((item) => selectedIds.includes(item.id)));
	let query = $state('');
	let editing = $state(false);
	let open = $state(false);
	let activeId = $state<string | undefined>();
	let composing = false;
	let root: HTMLDivElement;
	let panel: HTMLDivElement;
	let nativeSelect: HTMLSelectElement;
	const initialValue = Array.isArray(value) ? [...value] : value;
	const results = $derived(
		editing
			? items.filter((item) =>
					item.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
				)
			: items
	);
	const activeIndex = $derived(results.findIndex((item) => item.id === activeId && !item.disabled));
	const display = $derived(editing ? query : selected.map((item) => item.label).join(', '));
	const input = () => root?.querySelector('input') as HTMLInputElement | null;

	$effect(() => {
		if ((disabled || readonly) && (open || editing)) cancel();
	});
	$effect(() => {
		if (activeId && !results.some((item) => item.id === activeId && !item.disabled))
			activeId = undefined;
	});
	const show = () => {
		const source = input();
		if (!disabled && !readonly && source && panel && !panel.matches(':popover-open'))
			panel.showPopover({ source });
	};
	const cancel = () => {
		query = '';
		editing = false;
		activeId = undefined;
		if (panel?.matches(':popover-open')) panel.hidePopover();
	};
	const commit = (id: string) => {
		const item = results.find((candidate) => candidate.id === id && !candidate.disabled);
		if (!item || disabled || readonly) return;
		const next = multiple
			? selectedIds.includes(id)
				? selectedIds.filter((selectedId) => selectedId !== id)
				: [...selectedIds, id]
			: id;
		if (Array.isArray(next) ? next.length !== selectedIds.length : next !== value) {
			value = next;
			onChange?.(next);
		}
		if (!multiple) cancel();
		input()?.focus();
	};
	const move = (step: number) => {
		if (disabled || readonly) return;
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
		void tick().then(() =>
			panel
				?.querySelector(`#${CSS.escape(`${panelId}-${activeIndex}`)}`)
				?.scrollIntoView({ block: 'nearest' })
		);
	};
	const handleKeydown = (
		event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }
	) => {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			show();
			move(event.key === 'ArrowDown' ? 1 : -1);
		} else if (event.key === 'Home' || event.key === 'End') {
			if (open) {
				event.preventDefault();
				const enabled = results.filter((item) => !item.disabled);
				activeId = enabled[event.key === 'Home' ? 0 : enabled.length - 1]?.id;
			}
		} else if (event.key === 'Enter' && open && !event.isComposing && !composing && activeId) {
			event.preventDefault();
			commit(activeId);
		} else if (event.key === 'Escape' && (open || editing)) {
			event.preventDefault();
			cancel();
		}
		onkeydown?.(event);
	};
	onMount(() => {
		const owner = nativeSelect.form;
		let resetTimers: ReturnType<typeof setTimeout>[] = [];
		const reset = (event: Event) => {
			const timer = setTimeout(async () => {
				resetTimers = resetTimers.filter((pending) => pending !== timer);
				if (!event.defaultPrevented) {
					value = Array.isArray(initialValue) ? [...initialValue] : initialValue;
					cancel();
				}
				await tick();
				const field = input();
				if (field) field.value = display;
			}, 0);
			resetTimers.push(timer);
		};
		owner?.addEventListener('reset', reset);
		return () => {
			for (const timer of resetTimers) clearTimeout(timer);
			owner?.removeEventListener('reset', reset);
		};
	});
</script>

<div
	bind:this={root}
	data-combobox
	data-size={size}
	data-variant={variant}
	data-wide={wide || undefined}
	style={`--internal-anchor: --combobox-${generatedId}`}
>
	<Input
		multiline={false}
		{...attributes}
		{id}
		{placeholder}
		{disabled}
		{readonly}
		{size}
		{variant}
		{wide}
		icon={editing ? undefined : selected.length === 1 ? selected[0].icon : undefined}
		style={`width: 100%; ${inputStyle ?? ''}`}
		value={display}
		role="combobox"
		aria-autocomplete="list"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={panelId}
		aria-activedescendant={open && activeIndex >= 0 ? `${panelId}-${activeIndex}` : undefined}
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		aria-describedby={ariaDescribedby}
		aria-required={required || undefined}
		onChange={(next) => {
			query = next;
			editing = true;
			activeId = undefined;
			show();
		}}
		{oninput}
		onkeydown={handleKeydown}
		onfocus={(event) => {
			show();
			onfocus?.(event);
		}}
		onclick={(event) => {
			show();
			onclick?.(event);
		}}
		onblur={(event) => {
			queueMicrotask(() => {
				if (document.activeElement !== input()) cancel();
			});
			onblur?.(event);
		}}
		oncompositionstart={(event) => {
			composing = true;
			oncompositionstart?.(event);
		}}
		oncompositionend={(event) => {
			composing = false;
			oncompositionend?.(event);
		}}
	/>
	<div
		bind:this={panel}
		id={panelId}
		popover="auto"
		role="listbox"
		aria-multiselectable={multiple || undefined}
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		ontoggle={() => {
			open = panel.matches(':popover-open');
			if (!open && editing) cancel();
		}}
	>
		{#each results as item, index (item.id)}
			<Option
				id={`${panelId}-${index}`}
				{item}
				selected={selectedIds.includes(item.id)}
				active={item.id === activeId}
				onSelect={() => commit(item.id)}
			/>
		{:else}
			<p>
				{#if emptyMessage.icon}<Icon {...emptyMessage.icon} />{/if}{emptyMessage.message}
			</p>
		{/each}
	</div>
	<select
		bind:this={nativeSelect}
		hidden
		{name}
		{form}
		{required}
		{disabled}
		{multiple}
		tabindex={-1}
		oninvalid={(event) => {
			event.preventDefault();
			input()?.focus();
		}}
	>
		{#if !multiple}<option value="" selected={selectedIds.length === 0}>{placeholder}</option>{/if}
		{#each items as item (item.id)}<option
				value={item.id}
				selected={selectedIds.includes(item.id)}
				disabled={item.disabled}
			>
				{item.label}
			</option>{/each}
	</select>
</div>

<style>
	[data-combobox] {
		--internal-height: 2.5rem;
		--internal-padding: 0.85rem;
		--internal-icon-size: 1.25rem;
		--internal-tint: var(--color-foreground, black);
		--internal-strength-light: 3%;
		--internal-strength-dark: 3%;
		--internal-opacity: 15%;
		--internal-border: transparent;
		--internal-highlight: color-mix(in srgb, var(--color-foreground, black) 12%, transparent);
		anchor-name: var(--internal-anchor);
		position: relative;
		display: inline-block;
		width: min(100%, 18rem);
		min-width: 0;
	}
	[data-combobox][data-wide] {
		display: block;
		width: 100%;
	}
	[data-combobox][data-size='small'] {
		--internal-height: 2rem;
		--internal-padding: 0.65rem;
		--internal-icon-size: 1rem;
	}
	[data-combobox][data-size='large'] {
		--internal-height: 3rem;
		--internal-padding: 1rem;
		--internal-icon-size: 1.5rem;
	}
	[data-combobox][data-variant='soft'] {
		--internal-strength-light: 4%;
		--internal-strength-dark: 16%;
		--internal-opacity: 85%;
		--internal-border: light-dark(
			color-mix(in srgb, var(--color-foreground, black) 12%, transparent),
			color-mix(in srgb, var(--color-foreground, black) 30%, transparent)
		);
	}
	div[popover] {
		box-sizing: border-box;
		padding-inline: var(--internal-padding);
		border: 1px solid var(--internal-border);
		border-radius: 0.5rem;
		background: color-mix(
			in srgb,
			light-dark(
					color-mix(
						in srgb,
						var(--internal-tint) var(--internal-strength-light),
						var(--color-background, white)
					),
					color-mix(
						in srgb,
						var(--internal-tint) var(--internal-strength-dark),
						var(--color-background, white)
					)
				)
				var(--internal-opacity),
			transparent
		);
		color: var(--color-foreground, black);
		transition: all 150ms ease;
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
		font: inherit;
		font-size: 1rem;
		font-weight: 200;
		line-height: 1.4;
	}
	div[popover] {
		position: fixed;
		outline: none;
		position-anchor: var(--internal-anchor);
		position-area: bottom span-right;
		position-try-fallbacks: flip-block, flip-inline;
		inset: auto;
		width: anchor-size(var(--internal-anchor) width);
		min-width: 0;
		max-width: calc(100vw - 2rem);
		max-height: min(24rem, calc(100vh - 2rem));
		overflow: auto;
		margin: 0.375rem 0;
		padding: 0.5rem;
		flex-direction: column;
		align-items: stretch;
		gap: 0.375rem;
		--option-height: var(--internal-height);
		--option-icon-size: var(--internal-icon-size);
		box-shadow:
			inset 0 1px 0 var(--internal-highlight),
			0 0.5rem 1.5rem
				light-dark(
					color-mix(in srgb, black 12%, transparent),
					color-mix(in srgb, black 40%, transparent)
				),
			0 0.125rem 0.375rem
				light-dark(
					color-mix(in srgb, black 6%, transparent),
					color-mix(in srgb, black 25%, transparent)
				);
		opacity: 0;
		transform: translateY(-0.375rem);
		transition:
			opacity 150ms ease,
			transform 150ms ease,
			display 150ms allow-discrete,
			overlay 150ms allow-discrete;
	}
	div[popover]:popover-open {
		display: flex;
		opacity: 1;
		transform: translateY(0);
	}
	@starting-style {
		div[popover]:popover-open {
			opacity: 0;
			transform: translateY(-0.375rem);
		}
	}
	div[popover] p {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		padding-block: 0.5rem;
		color: var(--color-muted);
	}
	@supports not (position-area: bottom) {
		div[popover] {
			inset: 0;
			margin: auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		div[popover] {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		div[popover] {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
</style>
