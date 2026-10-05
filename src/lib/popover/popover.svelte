<script lang="ts">
	import Surface from '../surface/surface.svelte';
	import type { PopoverProps } from './types.js';

	let { trigger, children, open = $bindable(false) }: PopoverProps = $props();
	const id = $props.id();
	let anchor: HTMLDivElement;

	const syncPopover = (node: HTMLDivElement, initialOpen: boolean) => {
		const update = (force: boolean) =>
			node.togglePopover({ force, source: anchor.firstElementChild as HTMLElement });
		update(initialOpen);
		return { update };
	};
</script>

<div data-trigger bind:this={anchor}>
	{@render trigger()}
</div>
<div
	use:syncPopover={open}
	{id}
	popover="auto"
	ontoggle={(event) => (open = event.newState === 'open')}
>
	<Surface variant="filled" spacing="medium" radius="0.75rem" shadow scroll>
		<div data-content>{@render children()}</div>
	</Surface>
</div>

<style>
	div[data-trigger] {
		display: contents;
	}
	div[popover] {
		--internal-duration: 250ms;
		--internal-delay: 150ms;
		--internal-easing: cubic-bezier(0.3333, 1, 0.6667, 1);
		box-sizing: border-box;
		position: fixed;
		inset: auto;
		position-area: block-end;
		position-try-fallbacks: flip-block;
		width: anchor-size(width);
		max-width: calc(100vw - 1rem);
		max-height: min(24rem, calc(100% - 0.75rem));
		margin: 0.375rem 0;
		padding: 0;
		overflow: visible;
		overflow-wrap: anywhere;
		border: 0;
		background: transparent;
		color: var(--color-foreground, black);
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity var(--internal-duration) var(--internal-easing) var(--internal-delay),
			transform var(--internal-duration) var(--internal-easing) var(--internal-delay),
			display calc(var(--internal-duration) + var(--internal-delay)) allow-discrete,
			overlay calc(var(--internal-duration) + var(--internal-delay)) allow-discrete;
	}
	div:popover-open {
		display: flex;
		opacity: 1;
		transform: translateY(0);
	}
	@starting-style {
		div:popover-open {
			opacity: 0;
			transform: translateY(10px);
		}
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
