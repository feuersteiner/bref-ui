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
		const currentStrip = strip;
		const selected = currentStrip?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
		if (!currentStrip || !selected) return;
		// Reveal tabs inside this strip without moving page ancestors.
		const vertical = orientation === 'vertical';
		const bounds = currentStrip.getBoundingClientRect();
		const tab = selected.getBoundingClientRect();
		const styles = getComputedStyle(currentStrip);
		const start = vertical
			? bounds.top + currentStrip.clientTop + parseFloat(styles.paddingTop)
			: bounds.left + currentStrip.clientLeft + parseFloat(styles.paddingLeft);
		const end = vertical
			? bounds.top +
				currentStrip.clientTop +
				currentStrip.clientHeight -
				parseFloat(styles.paddingBottom)
			: bounds.left +
				currentStrip.clientLeft +
				currentStrip.clientWidth -
				parseFloat(styles.paddingRight);
		const tabStart = vertical ? tab.top : tab.left;
		const tabEnd = vertical ? tab.bottom : tab.right;
		const oversized = tabEnd - tabStart > end - start;
		let delta = 0;
		if (tabStart < start && tabEnd > end) return;
		if (tabStart < start) delta = oversized ? tabEnd - end : tabStart - start;
		else if (tabEnd > end) delta = oversized ? tabStart - start : tabEnd - end;
		if (delta)
			currentStrip.scrollBy({
				left: vertical ? 0 : delta,
				top: vertical ? delta : 0,
				behavior: 'instant'
			});
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
		buttons[next].focus({ preventScroll: true });
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
	data-size={size}
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
		gap: 0;
		justify-self: start;
		width: max-content;
		max-width: 100%;
		min-width: 0;
		padding: 0;
		border: 0;
		overflow: auto;
		overscroll-behavior-inline: contain;
		scrollbar-width: thin;
	}
	div[data-orientation='horizontal'] {
		scrollbar-width: none;
	}
	div[data-orientation='horizontal']::-webkit-scrollbar {
		display: none;
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
		border-color: var(--vscode-border);
		background: var(--vscode-panel);
	}
	[role='tablist'][data-orientation='horizontal'] {
		padding: 4px 8px 1px;
		scroll-padding-inline: 8px;
		background: #2b2b2b;
		box-shadow: inset 0 -1px var(--color-background);
	}
	div[data-orientation='horizontal']
		> :global(
			[role='tab']:not([aria-selected='true']) + [role='tab']:not([aria-selected='true'])::before
		) {
		content: '';
		position: absolute;
		inset-inline-start: 0;
		top: calc(50% - 8px);
		width: 1px;
		height: 16px;
		background: var(--vscode-border);
		pointer-events: none;
	}
	[role='tablist'][data-orientation='vertical'] {
		align-self: stretch;
		gap: 0;
		padding-block: 8px;
		padding-inline: 4px 1px;
		scroll-padding-block: 8px;
		background: #2b2b2b;
		box-shadow: inset -1px 0 var(--color-background);
	}
	[role='tablist'][data-orientation='vertical']:dir(rtl) {
		box-shadow: inset 1px 0 var(--color-background);
	}
	div[data-orientation='vertical']
		> :global(
			[role='tab']:not([aria-selected='true']) + [role='tab']:not([aria-selected='true'])::before
		) {
		content: '';
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: calc(50% - 8px);
		inline-size: 16px;
		block-size: 1px;
		background: var(--vscode-border);
		pointer-events: none;
	}
	@media (forced-colors: active) {
		[role='tablist'],
		[role='tablist'][data-orientation='horizontal'],
		[role='tablist'][data-orientation='vertical'],
		[role='tablist'][data-orientation='vertical']:dir(rtl) {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
			box-shadow: none;
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
