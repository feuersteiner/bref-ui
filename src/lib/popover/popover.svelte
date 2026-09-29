<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		trigger: Snippet;
		children: Snippet;
		disabled?: boolean;
	};

	const generatedId = $props.id();
	let { trigger, children, disabled = false, id = generatedId, ...attributes }: Props = $props();
</script>

<button type="button" popovertarget={id} {disabled}>
	{@render trigger()}
</button>
<div {...attributes} {id} popover="auto">
	{@render children()}
</div>

<style>
	button {
		min-height: 2.75rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-muted);
		border-radius: 0.5rem;
		background: var(--color-background);
		color: var(--color-foreground);
		font: inherit;
		cursor: pointer;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	div[popover] {
		position: fixed;
		position-anchor: auto;
		position-area: bottom span-right;
		position-try-fallbacks: flip-block, flip-inline;
		inset: auto;
		margin: 0;
		min-width: 12rem;
		max-width: min(24rem, calc(100vw - 2rem));
		max-height: min(24rem, calc(100vh - 2rem));
		overflow: auto;
		padding: 0.75rem;
		border: 1px solid var(--color-muted);
		border-radius: 0.5rem;
		background: var(--color-background);
		color: var(--color-foreground);
		box-shadow: 0 0.5rem 1.5rem color-mix(in srgb, var(--color-foreground) 14%, transparent);
	}

	@supports not (position-area: bottom) {
		div[popover] {
			inset: 0;
			margin: auto;
		}
	}

	@media (forced-colors: active) {
		button,
		div[popover] {
			border-color: CanvasText;
		}
	}
</style>
