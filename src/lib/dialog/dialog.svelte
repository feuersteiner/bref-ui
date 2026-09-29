<script lang="ts">
	import type { DialogProps } from './types.js';

	let {
		open = $bindable(false),
		title,
		description,
		children,
		dismissible = true,
		closeOnBackdropClick = true,
		onclose,
		oncancel,
		onclick,
		...attributes
	}: DialogProps = $props();

	let dialog: HTMLDialogElement;
	let returnFocus: HTMLElement | null = null;
	const id = $props.id();

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) {
			returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			dialog.showModal();
		}
		if (!open && dialog.open) dialog.close();
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

	const handleClick = (event: MouseEvent) => {
		if (closeOnBackdropClick && event.target === dialog) {
			const bounds = dialog.getBoundingClientRect();
			const outside =
				event.clientX < bounds.left ||
				event.clientX > bounds.right ||
				event.clientY < bounds.top ||
				event.clientY > bounds.bottom;
			if (outside) open = false;
		}
		onclick?.(event as MouseEvent & { currentTarget: EventTarget & HTMLDialogElement });
	};
</script>

<dialog
	bind:this={dialog}
	{...attributes}
	aria-labelledby={`${id}-title`}
	aria-describedby={description ? `${id}-description` : undefined}
	oncancel={handleCancel}
	onclose={handleClose}
	onclick={handleClick}
>
	<header>
		<div>
			<h2 id={`${id}-title`}>{title}</h2>
			{#if description}<p id={`${id}-description`}>{description}</p>{/if}
		</div>
		{#if dismissible}
			<button type="button" aria-label="Close dialog" onclick={requestClose}>×</button>
		{/if}
	</header>
	{#if children}<div data-content>{@render children()}</div>{/if}
</dialog>

<style>
	dialog {
		box-sizing: border-box;
		width: min(100% - 2rem, 42rem);
		max-width: 42rem;
		max-height: calc(100dvh - 2rem);
		margin: auto;
		padding: 0;
		border: 1px solid color-mix(in srgb, var(--color-foreground, black) 18%, transparent);
		border-radius: 0.75rem;
		background: var(--color-background, white);
		color: var(--color-foreground, black);
		box-shadow: 0 1.5rem 4rem color-mix(in srgb, var(--color-foreground, black) 20%, transparent);
	}
	dialog::backdrop {
		background: color-mix(in srgb, var(--color-foreground, black) 48%, transparent);
		backdrop-filter: blur(0.25rem);
	}
	header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.5rem 1.5rem 0;
	}
	h2 {
		margin: 0;
		font: inherit;
		font-size: 1.375rem;
		font-weight: 600;
	}
	p {
		margin: 0.5rem 0 0;
		color: var(--color-muted, #555);
		line-height: 1.5;
	}
	button {
		flex: none;
		width: 2.5rem;
		height: 2.5rem;
		border: 0;
		border-radius: 0.375rem;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: 1.5rem;
		cursor: pointer;
	}
	button:hover {
		background: color-mix(in srgb, currentColor 8%, transparent);
	}
	button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}
	[data-content] {
		padding: 1.5rem;
		overflow: auto;
	}
	@media (max-width: 36rem) {
		dialog {
			width: 100%;
			max-width: none;
			max-height: 100dvh;
			margin: auto 0 0;
			border-radius: 0.75rem 0.75rem 0 0;
		}
	}
	@media (forced-colors: active) {
		dialog {
			border-color: CanvasText;
			box-shadow: none;
		}
		dialog::backdrop {
			background: Canvas;
		}
	}
</style>
