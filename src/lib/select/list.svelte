<script lang="ts">
	import Option from './option.svelte';
	import Empty from './empty.svelte';
	import type { SelectListProps } from './types.js';

	let { id, items, value, emptyMessage, onSelect }: SelectListProps = $props();
	const multiple = $derived(Array.isArray(value));
</script>

<div {id} popover="auto">
	{#each items as item (item.id)}
		<Option
			{...item}
			panelId={id}
			{multiple}
			selected={Array.isArray(value) ? value.includes(item.id) : value === item.id}
			onSelect={() => onSelect(item.id)}
		/>
	{:else}
		<Empty {...emptyMessage} />
	{/each}
</div>

<style>
	div {
		position: fixed;
		position-anchor: var(--internal-anchor);
		position-area: bottom span-right;
		position-try-fallbacks: flip-block, flip-inline;
		inset: auto;
		box-sizing: border-box;
		width: anchor-size(var(--internal-anchor) width);
		max-width: calc(100vw - 2rem);
		max-height: min(24rem, calc(100vh - 2rem));
		overflow: auto;
		margin: 0.375rem 0;
		padding: 0.5rem;
		border: 1px solid color-mix(in srgb, var(--color-foreground) 16%, transparent);
		border-radius: 0.5rem;
		background: var(--color-background);
		color: var(--color-foreground);
		font: inherit;
		box-shadow: 0 0.5rem 1.5rem color-mix(in srgb, black 15%, transparent);
	}
	div:popover-open {
		display: grid;
		gap: 0.375rem;
	}
	@supports not (position-area: bottom) {
		div {
			inset: 0;
			margin: auto;
		}
	}
	@media (forced-colors: active) {
		div {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
		}
	}
</style>
