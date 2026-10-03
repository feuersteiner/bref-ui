<script lang="ts">
	import type { SwitchProps } from './types.js';

	let {
		checked = $bindable(false),
		size = 'medium',
		ref = $bindable(),
		...attributes
	}: SwitchProps = $props();
</script>

<input
	{...attributes}
	bind:this={ref}
	bind:checked
	type="checkbox"
	role="switch"
	data-size={size}
/>

<style>
	input {
		--track-width: 3.25rem;
		--track-height: 2rem;
		--thumb-size: 1.5rem;
		--inset: 0.25rem;
		appearance: none;
		position: relative;
		display: inline-block;
		width: var(--track-width);
		height: var(--track-height);
		margin: 0;
		border: 1px solid color-mix(in srgb, var(--color-foreground) 30%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-foreground) 12%, var(--color-background));
		vertical-align: middle;
		cursor: pointer;
		transition: background 150ms ease;
	}

	input::before {
		content: '';
		position: absolute;
		top: 50%;
		left: var(--inset);
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: 50%;
		background: var(--color-foreground);
		transform: translateY(-50%);
		transition:
			left 150ms ease,
			background 150ms ease;
	}

	input:checked {
		border-color: var(--color-primary);
		background: var(--color-primary);
	}

	input:checked::before {
		left: calc(100% - var(--thumb-size) - var(--inset));
		background: var(--color-background);
	}

	input:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}

	input:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	input[data-size='small'] {
		--track-width: 2.75rem;
		--track-height: 1.75rem;
		--thumb-size: 1.25rem;
	}

	input[data-size='large'] {
		--track-width: 3.75rem;
		--track-height: 2.25rem;
		--thumb-size: 1.625rem;
	}

	@media (prefers-reduced-motion: reduce) {
		input,
		input::before {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		input {
			border-color: ButtonText;
			background: Canvas;
		}
		input::before {
			background: ButtonText;
		}
		input:checked {
			background: Highlight;
		}
		input:checked::before {
			background: HighlightText;
		}
	}
</style>
