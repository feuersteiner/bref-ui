<script lang="ts">
	import type { TextareaProps } from './types.js';

	let {
		value = $bindable(),
		defaultValue,
		ref = $bindable(),
		size = 'medium',
		variant = 'neutral',
		resizable = true,
		...attributes
	}: TextareaProps = $props();
	const initialValue = value;
</script>

<textarea
	{...attributes}
	defaultValue={defaultValue ?? initialValue}
	bind:value
	bind:this={ref}
	data-size={size}
	data-variant={variant}
	data-resizable={resizable}></textarea>

<style>
	textarea {
		--internal-padding: 0.875rem;
		--internal-background: transparent;
		--internal-border: color-mix(
			in srgb,
			var(--color-foreground, black) 55%,
			var(--color-background, white)
		);
		box-sizing: border-box;
		min-width: 0;
		max-width: 100%;
		min-height: 6rem;
		padding: 0.75rem var(--internal-padding);
		border: 1px solid var(--internal-border);
		border-radius: 0.45rem;
		background: var(--internal-background);
		color: var(--color-foreground, black);
		font: inherit;
		font-size: 1rem;
		line-height: 1.45;
		resize: vertical;
	}
	textarea[data-size='small'] {
		--internal-padding: 0.65rem;
		min-height: 5rem;
	}
	textarea[data-size='large'] {
		--internal-padding: 1rem;
		min-height: 7rem;
	}
	textarea[data-variant='soft'] {
		--internal-background: color-mix(
			in srgb,
			var(--color-foreground, black) 8%,
			var(--color-background, white)
		);
	}
	textarea[data-resizable='false'] {
		resize: none;
	}
	textarea::placeholder {
		color: var(--color-muted, #666);
	}
	textarea:not(:disabled):hover {
		--internal-border: color-mix(
			in srgb,
			var(--color-foreground, black) 70%,
			var(--color-background, white)
		);
	}
	textarea:focus-visible {
		outline: 2px solid var(--color-primary, blue);
		outline-offset: 2px;
	}
	textarea:is(:invalid, [aria-invalid='true']) {
		--internal-border: var(--color-error, #bc2436);
	}
	textarea:is(:invalid, [aria-invalid='true']):focus-visible {
		outline-color: var(--color-error, #bc2436);
	}
	textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	textarea:read-only:not(:disabled) {
		cursor: default;
	}
	@media (forced-colors: active) {
		textarea {
			border-color: ButtonText;
		}
		textarea:is(:invalid, [aria-invalid='true']) {
			border-color: Mark;
		}
		textarea:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
