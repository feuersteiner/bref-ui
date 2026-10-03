<script lang="ts">
	/* eslint-disable max-lines -- Selection, listbox keyboard behavior, and native form state share one control. */
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import Option from './option.svelte';
	import type { SelectProps } from './types.js';

	const generatedId = $props.id();
	let {
		items,
		value = $bindable(),
		onChange,
		placeholder = 'Select…',
		size = 'medium',
		disabled = false,
		wide = false,
		variant = 'soft',
		emptyMessage = { message: 'No options found' },
		id = generatedId,
		name,
		form,
		required = false,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		'aria-describedby': ariaDescribedby,
		oninvalid,
		...attributes
	}: SelectProps = $props();

	const panelId = `${generatedId}-options`;
	const valueId = `${generatedId}-value`;
	const multiple = $derived(Array.isArray(value));
	const selectedIds = $derived(Array.isArray(value) ? value : value === undefined ? [] : [value]);
	const selected = $derived(items.filter((item) => selectedIds.includes(item.id)));
	let open = $state(false);
	let activeIndex = $state(-1);
	let trigger: HTMLButtonElement;
	let panel: HTMLElement;
	let nativeSelect: HTMLSelectElement;
	const initialValue = Array.isArray(value) ? [...value] : value;
	let typeahead = '';
	let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;
	let pendingOpenIndex: number | undefined;

	$effect(() => {
		if (disabled && open) panel?.hidePopover();
	});

	const enabledIndices = () => items.flatMap((item, index) => (item.disabled ? [] : [index]));
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
		setActive(
			indices[
				current < 0
					? step > 0
						? 0
						: indices.length - 1
					: (current + step + indices.length) % indices.length
			]
		);
	};
	const commit = (index: number) => {
		const item = items[index];
		if (!item || item.disabled) return;
		const next = multiple
			? selectedIds.includes(item.id)
				? selectedIds.filter((id) => id !== item.id)
				: [...selectedIds, item.id]
			: item.id;
		if (Array.isArray(next) ? next.length !== selectedIds.length : next !== value) {
			value = next;
			onChange?.(next);
		}
		if (!multiple) {
			panel.hidePopover();
			trigger.focus();
		} else panel.focus();
	};
	const onTriggerKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			const indices = enabledIndices();
			pendingOpenIndex = indices[event.key === 'ArrowDown' ? 0 : indices.length - 1] ?? -1;
			if (!open) panel.showPopover({ source: trigger });
			else setActive(pendingOpenIndex);
		}
	};
	const onPanelKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			move(event.key === 'ArrowDown' ? 1 : -1);
		} else if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault();
			const indices = enabledIndices();
			setActive(indices[event.key === 'Home' ? 0 : indices.length - 1] ?? -1);
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			commit(activeIndex);
		} else if (event.key === 'Escape') {
			event.preventDefault();
			panel.hidePopover();
			trigger.focus();
		} else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
			clearTimeout(typeaheadTimer);
			typeahead += event.key.toLocaleLowerCase();
			typeaheadTimer = setTimeout(() => (typeahead = ''), 500);
			const index = items.findIndex(
				(item) => !item.disabled && item.label.toLocaleLowerCase().startsWith(typeahead)
			);
			if (index >= 0) setActive(index);
		}
	};
	onMount(() => {
		const owner = nativeSelect.form;
		let resetTimers: ReturnType<typeof setTimeout>[] = [];
		const reset = (event: Event) => {
			const timer = setTimeout(() => {
				resetTimers = resetTimers.filter((pending) => pending !== timer);
				if (!event.defaultPrevented) {
					value = Array.isArray(initialValue) ? [...initialValue] : initialValue;
					panel?.hidePopover();
				}
			}, 0);
			resetTimers.push(timer);
		};
		owner?.addEventListener('reset', reset);
		return () => {
			for (const timer of resetTimers) clearTimeout(timer);
			owner?.removeEventListener('reset', reset);
			clearTimeout(typeaheadTimer);
		};
	});
</script>

<div
	data-select
	data-size={size}
	data-variant={variant}
	data-wide={wide || undefined}
	style={`--internal-anchor: --select-${generatedId}`}
>
	<button
		bind:this={trigger}
		{id}
		type="button"
		popovertarget={panelId}
		{disabled}
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={panelId}
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		aria-describedby={[ariaDescribedby, ariaLabel || ariaLabelledby ? valueId : undefined]
			.filter(Boolean)
			.join(' ') || undefined}
		onkeydown={onTriggerKeydown}
	>
		{#if selected.length === 1 && selected[0].icon}
			{#key selected[0].icon.name}
				<span data-icon in:fly={{ delay: 100, duration: 200, x: -6 }}>
					<Icon {...selected[0].icon} />
				</span>
			{/key}
		{/if}
		<span data-value data-placeholder={selected.length === 0 || undefined}>
			{selected.length ? selected.map((item) => item.label).join(', ') : placeholder}
		</span>
		<span data-icon><Icon name="arrow_drop_down" /></span>
	</button>
	<div
		bind:this={panel}
		id={panelId}
		popover="auto"
		role="listbox"
		aria-multiselectable={multiple || undefined}
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		aria-activedescendant={open && activeIndex >= 0 ? `${panelId}-${activeIndex}` : undefined}
		tabindex={-1}
		ontoggle={() => {
			open = panel.matches(':popover-open');
			if (open) {
				setActive(
					pendingOpenIndex ??
						items.findIndex((item) => selectedIds.includes(item.id) && !item.disabled)
				);
				if (activeIndex < 0) setActive(enabledIndices()[0] ?? -1);
				pendingOpenIndex = undefined;
				panel.focus();
			} else {
				typeahead = '';
				pendingOpenIndex = undefined;
			}
		}}
		onkeydown={onPanelKeydown}
	>
		{#each items as item, index (item.id)}
			<Option
				id={`${panelId}-${index}`}
				{item}
				selected={selectedIds.includes(item.id)}
				active={index === activeIndex}
				onSelect={() => commit(index)}
			/>
		{:else}
			<p>
				{#if emptyMessage.icon}<Icon {...emptyMessage.icon} />{/if}{emptyMessage.message}
			</p>
		{/each}
	</div>
	<span id={valueId} data-announcement>
		{selected.map((item) => item.label).join(', ') || placeholder}
	</span>
	<select
		{...attributes}
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
			trigger.focus();
			oninvalid?.(event);
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
	[data-select] {
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
	[data-select][data-wide] {
		display: block;
		width: 100%;
	}
	button[popovertarget] {
		display: flex;
	}
	button[popovertarget],
	div[popover] {
		box-sizing: border-box;
		align-items: center;
		align-self: start;
		gap: 0.6rem;
		width: 100%;
		min-width: 0;
		max-width: 100%;
		min-height: var(--internal-height);
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
		font: inherit;
		font-size: 1rem;
		font-weight: 200;
		line-height: 1.4;
		text-align: left;
		cursor: pointer;
		transition: all 150ms ease;
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
	}
	[data-select][data-size='small'] {
		--internal-height: 2rem;
		--internal-padding: 0.65rem;
		--internal-icon-size: 1rem;
	}
	[data-select][data-size='large'] {
		--internal-height: 3rem;
		--internal-padding: 1rem;
		--internal-icon-size: 1.5rem;
	}
	[data-select][data-variant='soft'] {
		--internal-strength-light: 4%;
		--internal-strength-dark: 16%;
		--internal-opacity: 85%;
		--internal-border: light-dark(
			color-mix(in srgb, var(--color-foreground, black) 12%, transparent),
			color-mix(in srgb, var(--color-foreground, black) 30%, transparent)
		);
	}
	[data-variant='soft'] button[popovertarget] {
		box-shadow: inset 0 1px 0 var(--internal-highlight);
	}
	button[popovertarget] [data-value] {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	button[popovertarget] [data-placeholder],
	button[popovertarget] [data-icon] {
		color: var(--color-muted, #666);
	}
	button[popovertarget] [data-icon] {
		display: inline-flex;
		flex: 0 0 auto;
		font-size: var(--internal-icon-size);
		pointer-events: none;
	}
	[data-variant='soft'] button[popovertarget]:hover:not(:disabled) {
		--internal-border: light-dark(
			color-mix(in srgb, var(--color-foreground, black) 18%, transparent),
			color-mix(in srgb, var(--color-foreground, black) 38%, transparent)
		);
		--internal-strength-light: 6%;
		--internal-strength-dark: 20%;
	}
	button[popovertarget]:focus-visible,
	button[popovertarget][aria-expanded='true'] {
		--internal-tint: var(--color-primary, blue);
		--internal-strength-light: 6%;
		--internal-strength-dark: 12%;
		--internal-border: color-mix(in srgb, var(--internal-tint) 55%, transparent);
		box-shadow:
			inset 0 1px 0 var(--internal-highlight),
			0 0 0 3px color-mix(in srgb, var(--internal-tint) 16%, transparent);
	}
	button[popovertarget]:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	div[popover] {
		position: fixed;
		outline: none;
		cursor: auto;
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
	[data-announcement] {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	@supports not (position-area: bottom) {
		div[popover] {
			inset: 0;
			margin: auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		button[popovertarget],
		div[popover] {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button[popovertarget],
		div[popover] {
			border-color: CanvasText;
		}
		button[popovertarget],
		div[popover] {
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		button[popovertarget]:focus-visible,
		button[popovertarget][aria-expanded='true'] {
			outline: 2px solid Highlight;
			outline-offset: 2px;
		}
	}
</style>
