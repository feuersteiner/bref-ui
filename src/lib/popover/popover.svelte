<script lang="ts">
	import Surface from '../surface/surface.svelte';
	import type { PopoverProps } from './types.js';

	let { trigger, children, open = $bindable(false) }: PopoverProps = $props();
	const id = $props.id();
	let button: HTMLButtonElement;
	let panel: HTMLDivElement;

	const position = () => {
		const viewport = window.visualViewport;
		const left = (viewport?.offsetLeft ?? 0) + 8;
		const top = (viewport?.offsetTop ?? 0) + 8;
		const right = left + (viewport?.width ?? document.documentElement.clientWidth) - 16;
		const bottom = top + (viewport?.height ?? window.innerHeight) - 16;
		const anchor = button.getBoundingClientRect();
		const below = Math.max(0, bottom - anchor.bottom - 6);
		const above = Math.max(0, anchor.top - top - 6);
		panel.style.width = `${anchor.width}px`;
		panel.style.maxWidth = `${Math.max(0, right - left)}px`;
		panel.style.maxHeight = `${Math.min(384, Math.max(below, above))}px`;
		const bounds = panel.getBoundingClientRect();
		const y =
			bounds.height <= below || below >= above ? anchor.bottom + 6 : anchor.top - bounds.height - 6;
		panel.style.left = `${Math.max(left, Math.min(anchor.left, right - bounds.width))}px`;
		panel.style.top = `${Math.max(top, Math.min(y, bottom - bounds.height))}px`;
	};

	const returnFocus = (event: ToggleEvent) => {
		if (event.newState !== 'closed' || !panel.contains(document.activeElement)) return;
		const focusButton = button;
		const focusPanel = panel;
		queueMicrotask(() => {
			if (
				focusButton.isConnected &&
				!focusPanel.matches(':popover-open') &&
				(document.activeElement === document.body || focusPanel.contains(document.activeElement))
			)
				focusButton.focus({ preventScroll: true });
		});
	};

	$effect(() => {
		if (!panel || !button) return;
		if (!open) {
			if (panel.matches(':popover-open')) panel.hidePopover();
			return;
		}
		if (!panel.matches(':popover-open')) panel.showPopover({ source: button });
		position();
		const observer = new ResizeObserver(position);
		observer.observe(button);
		observer.observe(panel);
		window.addEventListener('resize', position);
		window.addEventListener('scroll', position, true);
		window.visualViewport?.addEventListener('resize', position);
		window.visualViewport?.addEventListener('scroll', position);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', position);
			window.removeEventListener('scroll', position, true);
			window.visualViewport?.removeEventListener('resize', position);
			window.visualViewport?.removeEventListener('scroll', position);
		};
	});
</script>

<button
	bind:this={button}
	id={`${id}-trigger`}
	type="button"
	popovertarget={id}
	aria-controls={id}
	aria-expanded={open}
>
	{@render trigger()}
</button>
<div
	bind:this={panel}
	{id}
	popover="auto"
	onbeforetoggle={returnFocus}
	ontoggle={() => (open = panel.matches(':popover-open'))}
>
	<Surface variant="filled" spacing="medium" radius="0.75rem" shadow scroll>
		<div data-content>{@render children()}</div>
	</Surface>
</div>

<style>
	button {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		max-width: 100%;
		min-height: 2.75rem;
		padding: 0.5rem 1rem;
		border: 1px solid color-mix(in srgb, var(--color-foreground, black) 20%, transparent);
		border-radius: 0.75rem;
		background: color-mix(
			in srgb,
			var(--color-foreground, black) 6%,
			var(--color-background, white)
		);
		color: var(--color-foreground, black);
		font: inherit;
		overflow-wrap: anywhere;
		cursor: pointer;
	}
	button:hover,
	button[aria-expanded='true'] {
		background: color-mix(
			in srgb,
			var(--color-foreground, black) 12%,
			var(--color-background, white)
		);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary, blue);
		outline-offset: 3px;
	}
	div[popover] {
		box-sizing: border-box;
		position: fixed;
		inset: auto;
		max-width: calc(100vw - 1rem);
		max-height: min(24rem, calc(100dvh - 1rem));
		margin: 0;
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
	@media (forced-colors: active) {
		button {
			border-color: ButtonText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
		}
		button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
