<script lang="ts">
	import { overlayMotion } from '../theme/overlay-motion.js';
	import Surface from '../surface/surface.svelte';
	import type { PopoverProps } from 'bref-ui/types';
	import type { SurfaceProps } from 'bref-ui/types';

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

	const flyGlass = (node: Element) => overlayMotion(node, 250, 10, true);

	const showPopover = (node: HTMLDivElement) => {
		if (node.matches(':popover-open')) return;
		returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		node.showPopover({ source: anchor.firstElementChild as HTMLElement });
	};

	const surfacePropsWithDefaults: SurfaceProps = $derived({
		variant: 'soft',
		spacing: 'medium',
		radius: 'small',
		shadow: 'medium',
		...surfaceProps,
		glass: true
	});
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
		transition:flyGlass
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
		<Surface {...surfacePropsWithDefaults} data-surface-motion data-overlay>
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

	:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: 3px;
	}
	[popover] {
		--internal-duration: 100ms;
	}
	[popover]::backdrop {
		background: var(--crystal-code-veil);
		-webkit-backdrop-filter: blur(1px);
		backdrop-filter: blur(1px);
		transition: opacity 100ms ease;
	}
	[popover]::backdrop {
		opacity: 0;
		transition:
			opacity 100ms ease,
			display 100ms allow-discrete,
			overlay 100ms allow-discrete;
	}
	[popover]:popover-open::backdrop {
		opacity: 1;
	}
	@starting-style {
		[popover]:popover-open::backdrop {
			opacity: 0;
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		[popover]::backdrop {
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		[popover]::backdrop {
			transition: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (forced-colors: active) {
		[popover]::backdrop {
			background: Canvas;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
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
