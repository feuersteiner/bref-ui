<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import Surface from '../surface/surface.svelte';
	import type { PopoverProps } from './types.js';

	let {
		trigger,
		children,
		open = $bindable(false),
		disabled = false,
		...surfaceProps
	}: PopoverProps = $props();
	const id = $props.id();
	let anchor: HTMLDivElement;
	let returnFocus: HTMLElement | null = null;
	const defaultMaterial = $derived(
		surfaceProps.variant === undefined &&
			surfaceProps.color === undefined &&
			surfaceProps.class === undefined
	);

	const showPopover = (node: HTMLDivElement) => {
		if (node.matches(':popover-open')) return;
		returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		node.showPopover({ source: anchor.firstElementChild as HTMLElement });
	};
</script>

<div data-trigger bind:this={anchor}>
	{@render trigger()}
</div>
{#if open && !disabled}
	<div
		use:showPopover
		{id}
		popover="auto"
		data-width={surfaceProps.width}
		transition:fly={{ y: 10, duration: prefersReducedMotion.current ? 0 : 250 }}
		onintrostart={(event) => showPopover(event.currentTarget)}
		onoutrostart={(event) => {
			if (!event.currentTarget.matches(':popover-open')) return;
			if (document.activeElement === document.body && returnFocus?.isConnected) returnFocus.focus();
			event.currentTarget.hidePopover();
		}}
		ontoggle={(event) => {
			if (event.newState === 'closed' && !event.currentTarget.matches(':popover-open'))
				open = false;
		}}
	>
		<Surface
			{...surfaceProps}
			spacing={surfaceProps.spacing ?? 'medium'}
			radius={surfaceProps.radius ?? 'small'}
			shadow={surfaceProps.shadow ?? 'medium'}
			class={[defaultMaterial && 'glass', surfaceProps.class]}
		>
			<div data-content>{@render children()}</div>
		</Surface>
	</div>
{/if}

<style>
	div[data-trigger] {
		display: contents;
	}
	div[popover] {
		--internal-duration: 250ms;
		box-sizing: border-box;
		position: fixed;
		inset: auto;
		position-area: block-end;
		position-try-fallbacks: flip-block;
		width: fit-content;
		min-width: min(anchor-size(width), calc(100vw - 1rem));
		max-width: calc(100vw - 1rem);
		max-height: min(24rem, calc(100% - 0.75rem));
		margin: 0.375rem 0;
		padding: 0;
		overflow: visible;
		overflow-wrap: break-word;
		border: 0;
		background: transparent;
		color: var(--color-foreground, black);
		transition:
			opacity var(--internal-duration),
			transform var(--internal-duration),
			display var(--internal-duration) allow-discrete,
			overlay var(--internal-duration) allow-discrete;
	}
	div[popover][data-width='fill'] {
		width: anchor-size(width);
	}
	div:popover-open {
		display: flex;
	}
	div[data-content] {
		flex: none;
		min-width: 0;
	}
	@media (prefers-reduced-motion: reduce) {
		div[popover] {
			transition: none;
		}
	}
</style>
