<script lang="ts">
	import type { InputProps } from './types.js';

	let {
		type = 'text',
		value = $bindable(),
		defaultValue,
		ref = $bindable(),
		size = 'medium',
		variant = 'neutral',
		htmlSize,
		...attributes
	}: InputProps = $props();
	const initialValue = value;
</script>

<input
	{...attributes}
	{type}
	defaultValue={defaultValue ?? initialValue}
	bind:value={() => value, (next) => (value = next === null ? undefined : next)}
	bind:this={ref}
	size={htmlSize}
	data-size={size}
	data-variant={variant}
/>

<style>
	input {
		--internal-height: 48px;
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
		min-height: var(--internal-height);
		padding: 0.5rem var(--internal-padding);
		border: 1px solid var(--internal-border);
		border-radius: 0.45rem;
		background: var(--internal-background);
		color: var(--color-foreground, black);
		font: inherit;
		font-size: 1rem;
	}
	input[data-size='small'] {
		--internal-height: 40px;
		--internal-padding: 0.65rem;
	}
	input[data-size='large'] {
		--internal-height: 56px;
		--internal-padding: 1rem;
	}
	input[data-variant='soft'] {
		--internal-background: color-mix(
			in srgb,
			var(--color-foreground, black) 8%,
			var(--color-background, white)
		);
	}
	input::placeholder {
		color: var(--color-muted, #666);
	}
	input:not(:disabled):hover {
		--internal-border: color-mix(
			in srgb,
			var(--color-foreground, black) 70%,
			var(--color-background, white)
		);
	}
	input:focus-visible {
		outline: 2px solid var(--color-primary, blue);
		outline-offset: 2px;
	}
	input:is(:invalid, [aria-invalid='true']) {
		--internal-border: var(--color-error, #bc2436);
	}
	input:is(:invalid, [aria-invalid='true']):focus-visible {
		outline-color: var(--color-error, #bc2436);
	}
	input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	input:read-only:not(:disabled) {
		cursor: default;
	}
	@media (forced-colors: active) {
		input {
			border-color: ButtonText;
		}
		input:is(:invalid, [aria-invalid='true']) {
			border-color: Mark;
		}
		input:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
