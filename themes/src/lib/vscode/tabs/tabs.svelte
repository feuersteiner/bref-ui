<script lang="ts">
	import { tick } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import Item from './item.svelte';
	import type { TabsProps } from 'bref-ui/types';

	let {
		items,
		orientation = 'horizontal',
		width = 'fit',
		size = 'medium',
		value = $bindable(),
		onChange,
		label = 'Tabs',
		filled = false,
		transitionIn,
		transitionOut
	}: TabsProps = $props();
	let strip: HTMLDivElement | undefined = $state();
	const fallbackId = $derived(
		items.some((item) => item.id === value && !item.disabled)
			? undefined
			: items.find((item) => !item.disabled)?.id
	);
	const layout = $derived(orientation === 'horizontal' ? { orientation, width } : { orientation });
	const [send, receive] = crossfade({
		duration: () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180),
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
	data-width={orientation === 'horizontal' ? width : undefined}
	onkeydown={navigate}
>
	{#each items as item (item.id)}
		<Item
			{...item}
			selected={value === undefined || item.id === fallbackId ? undefined : value === item.id}
			{...layout}
			{size}
			{filled}
			onSelect={() => select(item.id)}
			transitionIn={intro}
			transitionOut={outro}
		/>
	{/each}
</div>

<style>
	div {
		box-sizing: border-box;
		display: inline-flex;
		align-self: start;
		align-items: stretch;
		gap: 0.5rem;
		justify-self: start;
		width: max-content;
		max-width: 100%;
		min-width: 0;
		padding: 4px;
		border: 0;
		overflow: auto;
		overscroll-behavior-inline: contain;
		scrollbar-width: thin;
	}
	div[data-width='fill'] {
		width: 100%;
	}
	div[data-orientation='vertical'] {
		flex-direction: column;
		max-height: 100%;
		min-height: 0;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior-block: contain;
	}

	:focus-visible {
		outline-color: var(--color-primary);
		outline-offset: 2px;
	}
	[role='tablist'] {
		--tabs-indicator-block-start: 0;
		border-color: var(--vscode-border);
		background: var(--vscode-panel);
	}
	[role='tablist'][data-orientation='vertical'] {
		--tabs-indicator-inline-start: 0;
	}
	@media (forced-colors: active) {
		[role='tablist'] {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
		}
	}
	@media (forced-colors: active) {
		:focus-visible {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none;
			transition: none;
		}
	}
</style>
