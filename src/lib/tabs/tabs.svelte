<script lang="ts">
	import { tick } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import Item from './item.svelte';
	import type { TabsProps } from './types.js';

	let {
		items,
		orientation = 'horizontal',
		size = 'fit',
		value = $bindable(),
		onChange,
		label = 'Tabs',
		filled = false,
		transitionIn,
		transitionOut
	}: TabsProps = $props();
	let strip: HTMLDivElement | undefined = $state();
	const layout = $derived(orientation === 'horizontal' ? { orientation, size } : { orientation });
	const [send, receive] = crossfade({
		duration: () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220),
		easing: cubicOut
	});
	const intro = (node: HTMLElement) =>
		transitionIn?.(node) ?? receive(node, { key: 'selected-tab' });
	const outro = (node: HTMLElement) => transitionOut?.(node) ?? send(node, { key: 'selected-tab' });
	const select = async (id: string) => {
		if (id === value || !items.some((item) => item.id === id && !item.disabled)) return;
		value = id;
		onChange?.(id);
		await tick();
		strip
			?.querySelector<HTMLButtonElement>('[aria-selected="true"]')
			?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
	};
	const navigate = (event: KeyboardEvent & { currentTarget: HTMLDivElement }) => {
		const buttons = [
			...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
		];
		const index = buttons.indexOf(event.target as HTMLButtonElement);
		if (index < 0) return;
		const vertical = orientation === 'vertical';
		const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
		const nextKey = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
		const previousKey = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
		let next: number;
		if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = buttons.length - 1;
		else if (event.key === nextKey) next = (index + 1) % buttons.length;
		else if (event.key === previousKey) next = (index - 1 + buttons.length) % buttons.length;
		else return;
		event.preventDefault();
		buttons[next].focus();
		buttons[next].click();
	};
</script>

<div
	bind:this={strip}
	role="tablist"
	tabindex={-1}
	aria-label={label}
	aria-orientation={orientation}
	data-orientation={orientation}
	data-size={orientation === 'horizontal' ? size : undefined}
	onkeydown={navigate}
>
	{#each items as item (item.id)}
		<Item
			{...item}
			selected={value === undefined ? undefined : value === item.id}
			{...layout}
			{filled}
			onSelect={() => select(item.id)}
			transitionIn={intro}
			transitionOut={outro}
		/>
	{/each}
</div>

<style>
	div {
		--tabs-indicator-block-start: auto;
		--tabs-indicator-inline-start: 0;
		--tabs-indicator-width: auto;
		--tabs-indicator-height: 2px;
		box-sizing: border-box;
		display: inline-flex;
		align-self: start;
		align-items: stretch;
		justify-self: start;
		width: max-content;
		max-width: 100%;
		min-width: 0;
		border: 0;
		border-block-end: 1px solid color-mix(in srgb, var(--color-foreground) 12%, transparent);
		overflow: auto;
		overscroll-behavior-inline: contain;
		scrollbar-width: thin;
	}
	div[data-size='fill'] {
		width: 100%;
	}
	div[data-orientation='vertical'] {
		--tabs-indicator-block-start: 0;
		--tabs-indicator-inline-start: auto;
		--tabs-indicator-width: 2px;
		--tabs-indicator-height: auto;
		flex-direction: column;
		max-height: 100%;
		min-height: 0;
		border-block-end: 0;
		border-inline-end: 1px solid color-mix(in srgb, var(--color-foreground) 12%, transparent);
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior-block: contain;
	}
	@media (forced-colors: active) {
		div {
			border-color: ButtonBorder;
		}
	}
</style>
