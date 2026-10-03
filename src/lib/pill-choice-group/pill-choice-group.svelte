<script lang="ts">
	import { onMount } from 'svelte';
	import Pill from '../pill/pill.svelte';
	import type { PillChoiceGroupProps } from './types.js';

	let {
		items,
		onDelete,
		selection = $bindable(),
		disabled = false,
		size = 'medium',
		variant = 'neutral',
		...attributes
	}: PillChoiceGroupProps = $props();

	let list: HTMLUListElement;
	const radioName = $props.id();
	const multiple = $derived(Array.isArray(selection));

	onMount(() => {
		const initialSelection = Array.isArray(selection) ? [...selection] : selection;
		const form = list.closest('form');
		if (!form) return;
		let timer: ReturnType<typeof setTimeout>;
		const reset = (event: Event) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				if (event.defaultPrevented) return;
				selection = Array.isArray(initialSelection) ? [...initialSelection] : initialSelection;
				list.querySelectorAll('input').forEach((input) => {
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
	});

	const select = (id: string, checked: boolean) => {
		if (disabled) return;
		selection = Array.isArray(selection)
			? checked
				? [...selection.filter((selected) => selected !== id), id]
				: selection.filter((selected) => selected !== id)
			: id;
	};
</script>

<ul bind:this={list} {...attributes} data-size={size} role={multiple ? 'group' : 'radiogroup'}>
	{#each items as item (item.id)}
		{@const selected = multiple ? (selection as string[]).includes(item.id) : selection === item.id}
		<li data-disabled={disabled || undefined}>
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
				color={selected ? 'primary' : 'foreground'}
				variant={selected ? (variant === 'neutral' ? 'soft' : 'filled') : variant}
				{size}
				onDelete={onDelete && !disabled ? () => onDelete?.(item.id) : undefined}
			>
				<label for={`${radioName}-${item.id}`}></label>
			</Pill>
		</li>
	{/each}
</ul>

<style>
	ul {
		--pill-group-gap: 0.5rem;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: var(--pill-group-gap);
		margin: 0;
		padding: 0;
	}
	ul[data-size='x-small'] {
		--pill-group-gap: 0.25rem;
	}
	ul[data-size='small'] {
		--pill-group-gap: 0.375rem;
	}
	ul[data-size='large'] {
		--pill-group-gap: 0.75rem;
	}
	ul[data-size='x-large'] {
		--pill-group-gap: 1rem;
	}
	li {
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
	li:has(input:focus-visible) {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
		border-radius: 999px;
	}
	li[data-disabled] label {
		pointer-events: none;
	}
	li[data-disabled] {
		opacity: 0.45;
		cursor: not-allowed;
	}
	@media (forced-colors: active) {
		li:has(input:checked) {
			outline: 2px solid Highlight;
			border-radius: 999px;
		}
	}
</style>
