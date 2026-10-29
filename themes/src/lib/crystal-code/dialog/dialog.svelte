<script lang="ts">
	import { tick } from 'svelte';
	import { overlayMotion } from '../theme/overlay-motion.js';
	import { MediaQuery } from 'svelte/reactivity';
	import { surface } from '../theme/surface.js';
	import Header from './header.svelte';
	import Footer from './footer.svelte';
	import type { DialogProps } from 'bref-ui/types';

	let {
		open = $bindable(false),
		header,
		children,
		footer,
		dismissible = true,
		size = 'medium',
		onclose,
		oncancel,
		...attributes
	}: DialogProps = $props();

	let dialog: HTMLDialogElement;
	let returnFocus: HTMLElement | null = null;
	const id = $props.id();
	const smallScreen = new MediaQuery('(max-width: 36rem)', false);
	const effectiveSize = $derived(smallScreen.current ? 'full-screen' : size);

	const showModal = (node: HTMLElement) => {
		const modal = node.closest('dialog');
		if (!modal || modal.open) return;
		returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		modal.showModal();
	};

	const dialogMotion = (node: Element) => overlayMotion(node, 300, 16);

	const requestClose = () => {
		if (dismissible) open = false;
	};

	const handleCancel = (event: Event & { currentTarget: EventTarget & HTMLDialogElement }) => {
		oncancel?.(event);
		const prevented = event.defaultPrevented;
		event.preventDefault();
		if (dismissible && !prevented) open = false;
	};

	const handleClose = (event: Event & { currentTarget: EventTarget & HTMLDialogElement }) => {
		open = false;
		onclose?.(event);
		tick().then(() => {
			if (open && dialog?.isConnected) {
				showModal(dialog);
				return;
			}
			if (returnFocus?.isConnected) returnFocus.focus();
			returnFocus = null;
		});
	};
</script>

<dialog
	bind:this={dialog}
	{...attributes}
	data-size={effectiveSize}
	data-visible={open}
	aria-labelledby={`${id}-title`}
	aria-describedby={header.description ? `${id}-description` : undefined}
	oncancel={handleCancel}
	onclose={handleClose}
>
	{#if open}
		<div
			data-surface
			class={surface({ color: 'background', glass: true, shadow: 'large' })}
			use:showModal
			transition:dialogMotion|global
			onoutroend={() => {
				if (!open) dialog.close();
			}}
		>
			<Header {...header} {dismissible} {id} onDismiss={requestClose} />
			<div data-content>{@render children()}</div>
			{#if footer}<Footer {footer} />{/if}
		</div>
	{/if}
</dialog>

<style>
	dialog {
		--internal-width: 42rem;
		box-sizing: border-box;
		width: min(calc(100% - 2rem), var(--internal-width));
		max-width: var(--internal-width);
		max-height: calc(100dvh - 2rem);
		margin: auto;
		padding: 0;
		border: 0;
		background: transparent;
		overflow: visible;
	}
	[data-surface] {
		--color-muted: var(--crystal-code-overlay-muted);
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		max-height: calc(100dvh - 2rem);
		border: 1px solid transparent;
		border-radius: 14px;
		background: var(--crystal-code-panel);
		color: var(--color-foreground);
		box-shadow:
			0 18px 70px #00000030,
			0 3px 12px #00000014;
		transition: color 100ms ease;
	}
	dialog[open] {
		display: flex;
		flex-direction: column;
	}
	dialog:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	dialog[data-size='x-small'] {
		--internal-width: 20rem;
	}
	dialog[data-size='small'] {
		--internal-width: 28rem;
	}
	dialog[data-size='large'] {
		--internal-width: 56rem;
	}
	dialog[data-size='x-large'] {
		--internal-width: 72rem;
	}
	dialog::backdrop {
		background: var(--crystal-code-veil);
		-webkit-backdrop-filter: blur(1px);
		backdrop-filter: blur(1px);
		opacity: 0;
		transition: opacity 100ms ease;
	}
	dialog[data-visible='true']::backdrop {
		opacity: 1;
	}
	@starting-style {
		dialog[data-visible='true']::backdrop {
			opacity: 0;
		}
	}
	[data-content] {
		min-height: 0;
		padding: 18px 24px 24px;
		overflow: auto;
	}
	dialog[data-size='full-screen'] {
		inset: 0.5rem;
		width: calc(100% - 1rem);
		height: calc(100dvh - 1rem);
		max-width: none;
		max-height: calc(100dvh - 1rem);
		margin: 0;
	}
	dialog[data-size='full-screen'] > [data-surface] {
		height: 100%;
		max-height: 100%;
	}
	dialog[data-size='full-screen'] [data-content] {
		flex: 1;
	}
	@supports (backdrop-filter: blur(1px)) {
		[data-surface] {
			background: var(--crystal-code-overlay);
			-webkit-backdrop-filter: blur(32px);
			backdrop-filter: blur(32px);
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		[data-surface] {
			background: var(--crystal-code-panel);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		dialog::backdrop {
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		[data-surface],
		dialog::backdrop {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		dialog:focus-visible {
			outline-color: Highlight;
		}
		[data-surface] {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		dialog::backdrop {
			background: Canvas;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
</style>
