<script lang="ts">
	/* eslint-disable max-lines -- The listbox behavior and native form control share one component. */
	import Popover from '../popover/popover.svelte';
	import Option from './option.svelte';
	import { onMount } from 'svelte';
	import type { SelectProps } from './types.js';

	const generatedId = $props.id();
	let {
		options,
		value = $bindable(),
		name,
		form,
		required = false,
		disabled = false,
		placeholder = 'Select…',
		size = 'medium',
		id = generatedId,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		'aria-describedby': ariaDescribedby
	}: SelectProps = $props();

	const panelId = `${generatedId}-options`;
	const valueId = `${generatedId}-value`;
	const selected = $derived(options.find((option) => option.value === value));
	let open = $state(false);
	let activeIndex = $state(-1);
	let triggerElement: HTMLButtonElement | undefined;
	let panel: HTMLElement | undefined;
	let nativeSelect: HTMLSelectElement;
	const initialValue = value;
	let typeahead = '';
	let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;
	let pendingOpenIndex: number | undefined;

	$effect(() => {
		if (disabled && open) panel?.hidePopover();
	});

	const enabledIndices = () => options.flatMap((option, index) => (option.disabled ? [] : [index]));

	const setActive = (index: number) => {
		activeIndex = index;
		if (index >= 0)
			panel
				?.querySelector(`#${CSS.escape(`${panelId}-${index}`)}`)
				?.scrollIntoView({ block: 'nearest' });
	};

	const move = (step: number) => {
		const indices = enabledIndices();
		if (!indices.length) return;
		const current = indices.indexOf(activeIndex);
		const next =
			current < 0
				? step > 0
					? 0
					: indices.length - 1
				: (current + step + indices.length) % indices.length;
		setActive(indices[next]);
	};

	const commit = (index: number) => {
		const option = options[index];
		if (!option || option.disabled) return;
		value = option.value;
		panel?.hidePopover();
		triggerElement?.focus();
	};

	const onTriggerKeydown = (event: KeyboardEvent) => {
		if (disabled) return;
		triggerElement = event.currentTarget as HTMLButtonElement;
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			panel = document.getElementById(panelId) as HTMLElement;
			const indices = enabledIndices();
			pendingOpenIndex =
				indices.find((index) => options[index].value === value) ??
				(event.key === 'ArrowDown' ? indices[0] : indices.at(-1)) ??
				-1;
			panel?.showPopover();
		}
	};

	const onPanelKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
				event.preventDefault();
				move(event.key === 'ArrowDown' ? 1 : -1);
				return;
			case 'Home':
			case 'End': {
				event.preventDefault();
				const indices = enabledIndices();
				setActive((event.key === 'Home' ? indices[0] : indices.at(-1)) ?? -1);
				return;
			}
			case 'Enter':
			case ' ':
				event.preventDefault();
				commit(activeIndex);
				return;
			case 'Escape':
				event.preventDefault();
				panel?.hidePopover();
				triggerElement?.focus();
				return;
		}
		if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
			clearTimeout(typeaheadTimer);
			typeahead += event.key.toLocaleLowerCase();
			typeaheadTimer = setTimeout(() => (typeahead = ''), 500);
			const index = options.findIndex(
				(option) => !option.disabled && option.label.toLocaleLowerCase().startsWith(typeahead)
			);
			if (index >= 0) setActive(index);
		}
	};

	const onToggle = (event: Event) => {
		panel = event.currentTarget as HTMLElement;
		open = panel.matches(':popover-open');
		if (open) {
			const indices = enabledIndices();
			setActive(
				pendingOpenIndex ??
					indices.find((index) => options[index].value === value) ??
					indices[0] ??
					-1
			);
			pendingOpenIndex = undefined;
			panel.focus();
		} else {
			pendingOpenIndex = undefined;
			clearTimeout(typeaheadTimer);
			typeahead = '';
		}
	};

	onMount(() => {
		const formElement = nativeSelect.form;
		const onReset = () => queueMicrotask(() => (value = initialValue));
		formElement?.addEventListener('reset', onReset);
		return () => {
			formElement?.removeEventListener('reset', onReset);
			clearTimeout(typeaheadTimer);
		};
	});
</script>

<div data-select data-size={size}>
	<Popover
		id={panelId}
		{disabled}
		role="listbox"
		tabindex={-1}
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		aria-activedescendant={open && activeIndex >= 0 ? `${panelId}-${activeIndex}` : undefined}
		ontoggle={onToggle}
		onkeydown={onPanelKeydown}
		triggerAttributes={{
			id,
			'aria-haspopup': 'listbox',
			'aria-expanded': open,
			'aria-controls': panelId,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledby,
			'aria-describedby':
				[ariaDescribedby, ariaLabel || ariaLabelledby ? valueId : undefined]
					.filter(Boolean)
					.join(' ') || undefined,
			onkeydown: onTriggerKeydown,
			onfocus: (event) => (triggerElement = event.currentTarget as HTMLButtonElement),
			onclick: (event) => (triggerElement = event.currentTarget as HTMLButtonElement)
		}}
	>
		{#snippet trigger()}{selected?.label ?? placeholder}{/snippet}
		{#each options as option, index (option.value)}
			<Option
				id={`${panelId}-${index}`}
				label={option.label}
				selected={option.value === value}
				disabled={option.disabled}
				active={index === activeIndex}
				onclick={() => commit(index)}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.stopPropagation();
						commit(index);
					}
				}}
			/>
		{:else}
			<p>No options</p>
		{/each}
	</Popover>
	<span id={valueId} data-value-announcement>{selected?.label ?? placeholder}</span>
	<select
		bind:this={nativeSelect}
		hidden
		{name}
		{form}
		{required}
		{disabled}
		value={value ?? ''}
		tabindex="-1"
		oninvalid={(event) => {
			event.preventDefault();
			triggerElement ??=
				nativeSelect.parentElement?.querySelector('button[popovertarget]') ?? undefined;
			triggerElement?.focus();
		}}
	>
		<option value="">{placeholder}</option>
		{#each options as option (option.value)}<option value={option.value} disabled={option.disabled}>
				{option.label}
			</option>{/each}
	</select>
</div>

<style>
	[data-select] {
		--popover-trigger-width: 100%;
		--popover-trigger-text-align: left;
		--popover-panel-min-width: 12rem;
		--popover-panel-width: anchor-size(width);
		--popover-trigger-height: 3rem;
		position: relative;
		display: inline-block;
		width: min(100%, 18rem);
	}
	[data-select][data-size='small'] {
		--popover-trigger-height: 2.5rem;
	}
	[data-select][data-size='large'] {
		--popover-trigger-height: 4rem;
	}
	[data-value-announcement] {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	p {
		margin: 0;
		color: var(--color-muted);
	}
</style>
