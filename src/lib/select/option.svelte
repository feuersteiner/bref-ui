<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = Omit<HTMLButtonAttributes, 'children'> & {
		label: string;
		selected?: boolean;
		active?: boolean;
	};

	let {
		label,
		selected = false,
		active = false,
		disabled = false,
		...attributes
	}: Props = $props();
</script>

<button
	{...attributes}
	type="button"
	role="option"
	tabindex="-1"
	aria-selected={selected}
	aria-disabled={disabled || undefined}
	data-active={active || undefined}
	{disabled}
>
	{label}
</button>

<style>
	button {
		display: block;
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: 0;
		border-radius: 0.375rem;
		background: transparent;
		color: var(--color-foreground);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	button[data-active],
	button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-primary) 14%, var(--color-background));
	}
	button:disabled {
		color: var(--color-muted);
		cursor: not-allowed;
	}
	@media (forced-colors: active) {
		button[data-active] {
			outline: 2px solid Highlight;
		}
		button:disabled {
			color: GrayText;
		}
	}
</style>
