<script lang="ts">
	import Surface from '../surface/surface.svelte';
	import type { PopoverProps } from './types.js';

	let { trigger, children, open = $bindable(false) }: PopoverProps = $props();
	const id = $props.id();
	const anchorName = `--popover-${id}`;
	let anchor: HTMLDivElement;

	const syncPopover = (node: HTMLDivElement, initialOpen: boolean) => {
		const update = (force: boolean) => node.togglePopover({ force, source: anchor });
		update(initialOpen);
		return { update };
	};
</script>

<div data-trigger bind:this={anchor} style:anchor-name={anchorName}>
	{@render trigger()}
</div>
<div
	use:syncPopover={open}
	{id}
	popover="auto"
	style:position-anchor={anchorName}
	ontoggle={(event) => (open = event.newState === 'open')}
>
	<Surface variant="filled" spacing="medium" radius="0.75rem" shadow scroll>
		<div data-content>{@render children()}</div>
	</Surface>
</div>

<style>
	div[data-trigger] {
		display: inline-flex;
		align-self: start;
		width: fit-content;
		min-width: 0;
		max-width: 100%;
	}
	div[popover] {
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
	}
	div:popover-open {
		display: flex;
	}
	div[data-content] {
		flex: none;
		min-width: 0;
	}
</style>
