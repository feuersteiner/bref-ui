<script lang="ts">
	/* eslint-disable max-lines -- Search, selection, and native form behavior share one control. */
	import { onMount, tick } from 'svelte';
	import Input from '../input/input.svelte';
	import Popover from '../popover/popover.svelte';
	import Option from '../select/option.svelte';
	import type { ComboboxProps } from './types.js';

	const generatedId = $props.id();
	let {
		options,
		value = $bindable(),
		name,
		form,
		required = false,
		disabled = false,
		size = 'medium',
		variant = 'neutral',
		filter = true,
		loading = false,
		error,
		emptyMessage = 'No options found',
		id = generatedId,
		placeholder = 'Select…',
		oninput,
		onkeydown,
		onblur,
		onfocus,
		onclick,
		oncompositionstart,
		oncompositionend,
		style: inputStyle,
		...attributes
	}: ComboboxProps = $props();

	const panelId = `${generatedId}-options`;
	const statusId = `${generatedId}-status`;
	const selected = $derived(options.find((option) => option.value === value));
	let query = $state('');
	let editing = $state(false);
	let open = $state(false);
	let activeValue = $state<string | undefined>();
	let composing = false;
	let inputRef: HTMLInputElement | undefined = $state();
	let panelRef: HTMLDivElement | undefined = $state();
	let nativeSelect: HTMLSelectElement;
	const initialValue = value;

	const results = $derived(
		filter && editing
			? options.filter((option) =>
					option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
				)
			: options
	);
	const activeIndex = $derived(
		loading || error
			? -1
			: results.findIndex((option) => option.value === activeValue && !option.disabled)
	);
	const displayedValue = $derived(editing ? query : (selected?.label ?? ''));
	const status = $derived(
		loading ? 'Loading options…' : error ? error : results.length ? '' : emptyMessage
	);

	$effect(() => {
		if (loading || error) activeValue = undefined;
	});
	$effect(() => {
		if (disabled && open) cancel();
	});
	$effect(() => {
		if (
			activeValue !== undefined &&
			!results.some((option) => option.value === activeValue && !option.disabled)
		)
			activeValue = undefined;
	});

	const show = () => {
		if (disabled || !inputRef || !panelRef) return;
		if (!panelRef.matches(':popover-open')) panelRef.showPopover({ source: inputRef });
	};

	const cancel = () => {
		query = '';
		editing = false;
		activeValue = undefined;
		if (panelRef?.matches(':popover-open')) panelRef.hidePopover();
	};

	const commit = (nextValue: string) => {
		const option = results.find(
			(candidate) => candidate.value === nextValue && !candidate.disabled
		);
		if (!option || loading || error) return;
		value = option.value;
		cancel();
		inputRef?.focus();
	};

	const move = (step: number) => {
		if (loading || error) return;
		const enabled = results.filter((option) => !option.disabled);
		if (!enabled.length) return;
		const index = enabled.findIndex((option) => option.value === activeValue);
		const next =
			index < 0
				? step > 0
					? 0
					: enabled.length - 1
				: (index + step + enabled.length) % enabled.length;
		activeValue = enabled[next].value;
		void tick().then(() =>
			panelRef
				?.querySelector(`#${CSS.escape(`${panelId}-${activeIndex}`)}`)
				?.scrollIntoView({ block: 'nearest' })
		);
	};

	const handleInput = (event: Event) => {
		query = (event.currentTarget as HTMLInputElement).value;
		editing = true;
		activeValue = undefined;
		show();
		oninput?.(event as Event & { currentTarget: EventTarget & HTMLInputElement });
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			show();
			move(event.key === 'ArrowDown' ? 1 : -1);
		} else if (event.key === 'Enter' && open && !event.isComposing && !composing) {
			if (activeValue !== undefined) {
				event.preventDefault();
				commit(activeValue);
			}
		} else if (event.key === 'Escape' && (open || editing)) {
			event.preventDefault();
			cancel();
		}
		onkeydown?.(event as KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement });
	};

	const handleBlur = (event: FocusEvent) => {
		queueMicrotask(() => {
			if (document.activeElement !== inputRef) cancel();
		});
		onblur?.(event as FocusEvent & { currentTarget: EventTarget & HTMLInputElement });
	};

	const handleFocus = (event: FocusEvent) => {
		show();
		onfocus?.(event as FocusEvent & { currentTarget: EventTarget & HTMLInputElement });
	};

	const handleClick = (event: MouseEvent) => {
		if (!editing) inputRef?.select();
		show();
		onclick?.(event as MouseEvent & { currentTarget: EventTarget & HTMLInputElement });
	};

	onMount(() => {
		const formElement = nativeSelect.form;
		const reset = () =>
			queueMicrotask(() => {
				value = initialValue;
				cancel();
			});
		formElement?.addEventListener('reset', reset);
		return () => formElement?.removeEventListener('reset', reset);
	});
</script>

<div data-combobox data-size={size}>
	<Input
		{...attributes}
		{id}
		{placeholder}
		{disabled}
		{size}
		{variant}
		style={`width: 100%; ${inputStyle ?? ''}`}
		value={displayedValue}
		bind:ref={inputRef}
		role="combobox"
		aria-autocomplete="list"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={panelId}
		aria-activedescendant={open && activeIndex >= 0 ? `${panelId}-${activeIndex}` : undefined}
		aria-busy={loading || undefined}
		aria-invalid={error ? 'true' : attributes['aria-invalid']}
		aria-required={required || undefined}
		aria-describedby={[attributes['aria-describedby'], status ? statusId : undefined]
			.filter(Boolean)
			.join(' ') || undefined}
		onfocus={handleFocus}
		onclick={handleClick}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onblur={handleBlur}
		oncompositionstart={(event) => {
			composing = true;
			oncompositionstart?.(event);
		}}
		oncompositionend={(event) => {
			composing = false;
			oncompositionend?.(event);
		}}
	/>
	<Popover
		id={panelId}
		bind:panelRef
		role="listbox"
		aria-label={attributes['aria-label']}
		aria-labelledby={attributes['aria-labelledby']}
		ontoggle={(event) => {
			open = (event.currentTarget as HTMLElement).matches(':popover-open');
			if (!open && editing) cancel();
		}}
	>
		{#if status}
			<p id={statusId} role={error ? 'alert' : 'status'}>{status}</p>
		{:else}
			{#each results as option, index (option.value)}
				<Option
					id={`${panelId}-${index}`}
					label={option.label}
					selected={option.value === value}
					active={option.value === activeValue}
					disabled={option.disabled}
					onpointerdown={(event) => event.preventDefault()}
					onclick={() => commit(option.value)}
				/>
			{/each}
		{/if}
	</Popover>
	<select
		bind:this={nativeSelect}
		hidden
		{name}
		{form}
		{required}
		{disabled}
		value={selected?.value ?? ''}
		tabindex="-1"
		oninvalid={(event) => {
			event.preventDefault();
			inputRef?.focus();
		}}
	>
		<option value="">{placeholder}</option>
		{#each options as option (option.value)}<option value={option.value} disabled={option.disabled}>
				{option.label}
			</option>{/each}
	</select>
</div>

<style>
	[data-combobox] {
		--popover-panel-width: anchor-size(width);
		position: relative;
		display: inline-block;
		width: min(100%, 18rem);
	}
	p {
		margin: 0;
		padding: 0.625rem 0.75rem;
		color: var(--color-muted);
	}
</style>
