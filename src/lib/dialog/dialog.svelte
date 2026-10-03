<script lang="ts">
	/* eslint-disable max-lines -- Keep the native dialog lifecycle and transition styles together. */
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

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) {
			returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			dialog.showModal();
		}
	});

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
		queueMicrotask(() => {
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
			transition:fly|global={{
				y: prefersReducedMotion.current ? 0 : 16,
				duration: prefersReducedMotion.current ? 0 : 300
			}}
			onoutroend={() => {
				if (!open) dialog.close();
			}}
		>
			<Header
				{header}
				{dismissible}
				titleId={`${id}-title`}
				descriptionId={`${id}-description`}
				onDismiss={requestClose}
			/>
			{#if children}<div data-content>{@render children()}</div>{/if}
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
		display: flex;
		flex-direction: column;
		max-height: calc(100dvh - 2rem);
		border: 1px solid color-mix(in srgb, var(--color-foreground, black) 18%, transparent);
		border-radius: 0.75rem;
		background: var(--color-background, white);
		color: var(--color-foreground, black);
		box-shadow: 0 1.5rem 4rem color-mix(in srgb, var(--color-foreground, black) 20%, transparent);
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
		background: color-mix(in srgb, var(--color-foreground, black) 48%, transparent);
		opacity: 0;
		backdrop-filter: blur(0);
		transition:
			opacity 300ms ease,
			backdrop-filter 300ms ease;
	}
	dialog[data-visible='true']::backdrop {
		opacity: 1;
		backdrop-filter: blur(0.25rem);
	}
	@starting-style {
		dialog[data-visible='true']::backdrop {
			opacity: 0;
			backdrop-filter: blur(0);
		}
	}
	[data-content] {
		min-height: 0;
		padding: 1.5rem;
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
			border-color: CanvasText;
			box-shadow: none;
		}
		dialog::backdrop {
			background: Canvas;
		}
	}
</style>
