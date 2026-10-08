<script lang="ts">
	/* eslint-disable max-lines -- Keep the native dialog lifecycle and transition styles together. */
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import Header from './header.svelte';
	import Footer from './footer.svelte';
	import type { DialogProps } from './types.js';

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
			class={['glass']}
			use:showModal
			transition:fly|global={{
				y: prefersReducedMotion.current ? 0 : 16,
				duration: prefersReducedMotion.current ? 0 : 300
			}}
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
		--surface-shadow: 0 1.5rem 4rem color-mix(in srgb, var(--shadow-color, #000) 20%, transparent);
		display: flex;
		flex-direction: column;
		max-height: calc(100dvh - 2rem);
		border-radius: 1rem;
	}
	dialog[open] {
		display: flex;
		flex-direction: column;
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
		background: var(--scrim, rgb(0 0 0 / 48%));
		opacity: 0;
		transition: opacity 300ms ease;
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
		padding: 1.25rem 1.75rem 1.5rem;
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
		box-sizing: border-box;
		height: 100%;
		max-height: 100%;
	}
	dialog[data-size='full-screen'] [data-content] {
		flex: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		dialog::backdrop {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		[data-surface] {
			border: 1px solid CanvasText;
		}
		dialog::backdrop {
			background: Canvas;
		}
	}
</style>
