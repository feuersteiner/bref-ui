<script lang="ts">
	import { createAttachmentKey } from 'svelte/attachments';
	import Surface from '../surface/surface.svelte';
	import type { PopoverProps } from './types.js';

	let { trigger, children, open = $bindable(false) }: PopoverProps = $props();
	const id = $props.id();
	let button = $state<HTMLElement>();
	const attachmentKey = createAttachmentKey();
	const attach = (element: HTMLElement) => {
		button = element;
		return () => {
			if (button === element) button = undefined;
		};
	};
	const wiring = $derived({
		popovertarget: id,
		'aria-controls': id,
		'aria-expanded': open,
		[attachmentKey]: attach
	});
	let panel: HTMLDivElement;

	const position = () => {
		if (!button) return;
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
		if (!button || event.newState !== 'closed' || !panel.contains(document.activeElement)) return;
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

{@render trigger(wiring)}
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
</style>
