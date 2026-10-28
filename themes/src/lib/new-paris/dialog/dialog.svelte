<script lang="ts">
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { surface } from '../theme/surface.js';
	import Header from './header.svelte';
	import Footer from './footer.svelte';
	import type { DialogProps } from '#bref-types';

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
			class={surface({ color: 'background', glass: true, shadow: 'large' })}
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
	.bref-surface {
		--surface-color: var(--color-foreground, black);
		--surface-base: var(--color-background, white);
		--surface-foreground: var(--color-foreground, black);
		--surface-tint: var(--surface-color);
		--surface-soft-strength: 24%;
		--surface-neutral-strength: 2%;
		--surface-strength: var(--surface-neutral-strength);
		--surface-hover: 0%;
		--surface-fill: color-mix(in srgb, var(--surface-tint) var(--surface-strength), transparent);
		--surface-border: transparent;
		--surface-content: var(--surface-color);
		--surface-neutral-content: color-mix(
			in srgb,
			var(--surface-color) 80%,
			var(--surface-foreground)
		);
		--surface-highlight: 0 0 0 transparent;
		--surface-shadow: 0 0 0 transparent;
		box-sizing: border-box;
		border: 1px solid var(--surface-border);
		background: var(--surface-fill);
		color: var(--surface-content);
		box-shadow: var(--surface-highlight), var(--surface-shadow);
		transition:
			background-color 150ms ease,
			border-color 150ms ease,
			box-shadow 150ms ease,
			color 150ms ease;
	}
	.bref-surface-primary {
		--surface-color: var(--color-primary, blue);
	}
	.bref-surface-secondary {
		--surface-color: var(--color-secondary, purple);
	}
	.bref-surface-foreground {
		--surface-color: var(--color-foreground, black);
	}
	.bref-surface-background {
		--surface-color: var(--color-background, white);
		--surface-tint: var(--surface-foreground);
		--surface-soft-strength: 5%;
		--surface-content: inherit;
		--surface-neutral-content: inherit;
	}
	.bref-surface-muted {
		--surface-color: var(--color-muted, gray);
	}
	.bref-surface-info {
		--surface-color: var(--color-info, blue);
	}
	.bref-surface-success {
		--surface-color: var(--color-success, green);
	}
	.bref-surface-warning {
		--surface-color: var(--color-warning, brown);
	}
	.bref-surface-error {
		--surface-color: var(--color-error, red);
	}
	.bref-surface-soft {
		--surface-strength: var(--surface-soft-strength);
		--surface-fill: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-strength),
			var(--surface-base)
		);
		--surface-content: color-mix(in srgb, var(--surface-color) 80%, var(--surface-foreground));
	}
	.bref-surface-filled {
		--surface-strength: 100%;
		--surface-fill: color-mix(
			in srgb,
			var(--surface-color) var(--surface-strength),
			var(--surface-foreground)
		);
		--surface-content: var(--surface-base);
	}
	.bref-surface-background.bref-surface-filled {
		--surface-fill: color-mix(
			in srgb,
			var(--surface-base) var(--surface-strength),
			var(--surface-foreground)
		);
	}
	.bref-surface-background:is(.bref-surface-soft, .bref-surface-filled) {
		--surface-content: var(--surface-foreground);
	}
	.bref-surface-shadow-small {
		--surface-shadow: 0 2px 6px color-mix(in srgb, black 8%, transparent);
	}
	.bref-surface-shadow-medium {
		--surface-shadow: 0 0.5rem 1.5rem color-mix(in srgb, black 12%, transparent);
	}
	.bref-surface-shadow-large {
		--surface-shadow: 0 1.5rem 4rem color-mix(in srgb, black 20%, transparent);
	}
	.bref-surface-hover-small {
		--surface-hover: 2%;
	}
	.bref-surface-hover-medium {
		--surface-hover: 4%;
	}
	.bref-surface-hover-large {
		--surface-hover: 8%;
	}

	.bref-surface-soft:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:hover,
			:focus-visible,
			[data-surface-pressed='true']
		) {
		--surface-strength: calc(var(--surface-soft-strength) + var(--surface-hover));
	}

	.bref-surface-filled:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:hover,
			:focus-visible,
			[data-surface-pressed='true']
		) {
		--surface-strength: calc(100% - var(--surface-hover));
	}

	.bref-surface-neutral:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:hover,
			:focus-visible,
			[data-surface-pressed='true']
		) {
		--surface-strength: calc(var(--surface-neutral-strength) + var(--surface-hover));
		--surface-content: var(--surface-neutral-content);
	}

	.bref-surface:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:active,
			[data-surface-pressed='true']
		) {
		--surface-hover: 8%;
	}
	.bref-surface:is(:focus-visible, [data-surface-focused='true']) {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
	}
	.bref-surface[data-surface-invalid='true'] {
		border-color: var(--color-error, red);
	}
	.bref-surface:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true']) {
		opacity: 0.45;
		cursor: not-allowed;
	}
	@media (prefers-reduced-motion: reduce) {
		.bref-surface {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		.bref-surface {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		.bref-surface:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true']) {
			color: GrayText;
			opacity: 1;
		}
		.bref-surface:is(:focus-visible, [data-surface-focused='true']) {
			outline-color: Highlight;
		}
	}

	.bref-glass {
		--glass-paint: var(--surface-fill, var(--color-background, white));
		--glass-opacity: 20%;
		--glass-blur: blur(0.75rem) saturate(120%);
	}
	.bref-glass {
		background: var(--glass-paint);
		color: var(--surface-content, var(--color-foreground, black));
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--color-foreground, black) 8%, transparent),
			var(--surface-shadow, 0 0.5rem 1.5rem color-mix(in srgb, black 12%, transparent));
	}
	.bref-glass:where(.bref-surface-neutral) {
		--glass-paint: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-strength),
			var(--surface-base)
		);
	}
	.bref-glass:where(.bref-surface-soft) {
		--glass-opacity: 40%;
	}
	.bref-glass:where(.bref-surface-filled) {
		--glass-opacity: 65%;
	}
	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.bref-glass {
			background: color-mix(in srgb, var(--glass-paint) var(--glass-opacity), transparent);
			-webkit-backdrop-filter: var(--glass-blur);
			backdrop-filter: var(--glass-blur);
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-glass {
			background: var(--glass-paint);
			box-shadow: var(--surface-shadow, 0 0 0 transparent);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-glass {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}

		.bref-glass:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true']) {
			color: GrayText;
			opacity: 1;
		}
	}

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
		background: color-mix(in srgb, var(--color-background, white) 48%, transparent);
		-webkit-backdrop-filter: blur(0);
		backdrop-filter: blur(0);
		opacity: 0;
		transition:
			opacity 300ms ease,
			-webkit-backdrop-filter 300ms ease,
			backdrop-filter 300ms ease;
	}
	dialog[data-visible='true']::backdrop {
		-webkit-backdrop-filter: blur(0.25rem);
		backdrop-filter: blur(0.25rem);
		opacity: 1;
	}
	@starting-style {
		dialog[data-visible='true']::backdrop {
			-webkit-backdrop-filter: blur(0);
			backdrop-filter: blur(0);
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
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}

	.bref-surface {
		border-radius: 0;
	}
	.bref-surface {
		--surface-soft-strength: 7%;
		--surface-neutral-strength: 0%;
		--surface-border: var(--np-rule);
		--surface-highlight: 0 0 0 transparent;
	}
	.bref-surface-filled {
		--surface-border: var(--surface-color);
	}
	.bref-surface-soft {
		--surface-border: transparent;
	}
	.bref-surface:is(
		.bref-surface-shadow-small,
		.bref-surface-shadow-medium,
		.bref-surface-shadow-large
	) {
		--surface-shadow: 0 12px 36px color-mix(in srgb, var(--color-foreground) 9%, transparent);
	}
	.bref-glass {
		background: var(--np-paper);
		box-shadow: var(--surface-shadow);
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
	}
	dialog > [data-surface] {
		background: var(--np-paper);
		border: 1px solid var(--np-rule);
	}
	dialog::backdrop {
		background: color-mix(in srgb, var(--color-foreground) 30%, transparent);
	}
	:focus-visible:not(input) {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	@media (forced-colors: active) {
		.bref-surface {
			background: Canvas;
			color: CanvasText;
			border-color: CanvasText;
			box-shadow: none;
		}
	}
	@media (forced-colors: active) {
		.bref-glass {
			background: Canvas;
			color: CanvasText;
			border-color: CanvasText;
			box-shadow: none;
		}
	}
	@media (forced-colors: active) {
		:focus-visible:not(input) {
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
