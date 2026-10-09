<script lang="ts">
	import { untrack } from 'svelte';
	import Pill from '../pill/pill.svelte';
	import Container from '../pill-group/container.svelte';
	import type { PillChoiceGroupProps } from './types.js';

	let {
		items,
		onDelete,
		selection = $bindable(),
		disabled = false,
		size = 'medium',
		variant = 'neutral',
		color = 'foreground',
		glass,
		animateSelected = false,
		...attributes
	}: PillChoiceGroupProps = $props();

	const radioName = $props.id();
	const multiple = $derived(Array.isArray(selection));

	const initialSelection = untrack(() => (Array.isArray(selection) ? [...selection] : selection));

	const attachReset = (element: HTMLUListElement) => {
		const form = element.closest('form');
		if (!form) return;
		let timer: ReturnType<typeof setTimeout>;
		const reset = (event: Event) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				if (event.defaultPrevented) return;
				selection = Array.isArray(initialSelection) ? [...initialSelection] : initialSelection;
				element.querySelectorAll('input').forEach((input) => {
					input.checked = Array.isArray(initialSelection)
						? initialSelection.includes(input.value)
						: input.value === initialSelection;
				});
			}, 0);
		};
		form.addEventListener('reset', reset);
		return () => {
			clearTimeout(timer);
			form.removeEventListener('reset', reset);
		};
	};

	const select = (id: string, checked: boolean) => {
		if (disabled) return;
		selection = Array.isArray(selection)
			? checked
				? [...selection.filter((selected) => selected !== id), id]
				: selection.filter((selected) => selected !== id)
			: id;
	};

	const selectedVariant = $derived(variant === 'soft' ? 'filled' : 'soft');
</script>

<Container
	{@attach attachReset}
	{...attributes}
	{items}
	{size}
	role={multiple ? 'group' : 'radiogroup'}
>
	{#snippet renderItem(item)}
		{@const selected = multiple ? (selection as string[]).includes(item.id) : selection === item.id}
		<div data-disabled={disabled || undefined}>
			<input
				id={`${radioName}-${item.id}`}
				aria-label={item.label}
				type={multiple ? 'checkbox' : 'radio'}
				name={multiple ? undefined : radioName}
				value={item.id}
				checked={selected}
				{disabled}
				onchange={(event) => select(item.id, event.currentTarget.checked)}
			/>
			<Pill
				label={item.label}
				icon={item.icon}
				{color}
				{glass}
				swoosh={selected && animateSelected}
				variant={selected ? selectedVariant : variant}
				{size}
				onDelete={onDelete && !disabled ? () => onDelete?.(item.id) : undefined}
			>
				<label for={`${radioName}-${item.id}`}></label>
			</Pill>
		</div>
	{/snippet}
</Container>

<style>
	div {
		display: inline-flex;
		max-width: 100%;
		min-width: 0;
	}
	label {
		position: absolute;
		inset: 0;
		cursor: pointer;
	}
	input {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		clip-path: inset(50%);
		overflow: hidden;
	}
	div:has(input:checked) {
		--pill-choice-emphasis: 18%;
	}
	div:not([data-disabled]):is(:hover, :has(input:focus-visible)) {
		--pill-choice-hover: 2%;
	}
	div:not([data-disabled]):active {
		--pill-choice-hover: 4%;
	}
	div:has(input:focus-visible) {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
		border-radius: 999px;
	}
	div[data-disabled] label {
		pointer-events: none;
	}
	div[data-disabled] {
		opacity: 0.45;
		cursor: not-allowed;
	}
	@media (pointer: coarse) {
		div {
			display: inline-grid;
			min-width: 44px;
			min-height: 44px;
			align-items: stretch;
		}
	}
	@media (forced-colors: active) {
		div:has(input:checked) {
			outline: 2px solid Highlight;
			border-radius: 999px;
		}
	}
</style>
