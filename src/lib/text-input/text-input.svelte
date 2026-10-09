<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import { surface } from '../theme/surface.js';
	import type { TextInputProps } from './types.js';

	let {
		value = $bindable(),
		onChange,
		icon,
		size = 'medium',
		wide = false,
		variant = 'soft',
		glass = false,
		oninput,
		defaultValue,
		...attributes
	}: TextInputProps = $props();
	const initialValue = value;

	const handleInput = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		onChange?.(event.currentTarget.value);
		oninput?.(event);
	};
</script>

<div
	class={surface({
		color: 'background',
		variant,
		glass,
		hover: variant === 'soft' && !attributes.disabled ? 'small' : undefined
	})}
	data-size={size}
	data-variant={variant}
	data-wide={wide || undefined}
>
	{#if icon}
		<span><Icon {...icon} label={undefined} /></span>
	{/if}
	<input
		{...attributes}
		defaultValue={defaultValue ?? initialValue}
		bind:value={() => value, (next) => (value = next == null ? '' : String(next))}
		oninput={handleInput}
	/>
</div>

<style>
	div {
		--internal-height: 2.5rem;
		--internal-padding: 1rem;
		--internal-icon-size: 1.25rem;
		--internal-placeholder: color-mix(in srgb, var(--color-muted,) 35%, var(--color-foreground));
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		align-self: start;
		gap: 0.625rem;
		width: min(100%, 18rem);
		min-width: 0;
		max-width: 100%;
		min-height: var(--internal-height);
		padding-inline: var(--internal-padding);
		border-radius: 0.625rem;
	}
	div[data-wide] {
		width: 100%;
	}
	div[data-size='small'] {
		--internal-height: 2rem;
		--internal-padding: 0.75rem;
		--internal-icon-size: 1rem;
	}
	div[data-size='large'] {
		--internal-height: 3rem;
		--internal-padding: 1.125rem;
		--internal-icon-size: 1.5rem;
	}
	span {
		display: inline-flex;
		flex: 0 0 auto;
		color: var(--color-muted);
		font-size: var(--internal-icon-size);
		pointer-events: none;
	}
	input {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		padding: 0;
		border: 0;
		outline: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: 1rem;
		font-weight: 200;
		line-height: 1.5;
	}
	input {
		height: calc(var(--internal-height) - 2px);
	}
	input[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input::placeholder {
		color: var(--internal-placeholder);
		opacity: 1;
	}
	div:has(input:focus) {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	div:has(input:user-invalid, input[aria-invalid='true']) {
		--surface-border: var(--color-error);
		outline-color: var(--color-error);
	}
	div:has(:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
	div[data-variant='soft']:has(input:disabled):hover {
		--surface-strength: var(--surface-soft-strength);
	}
	input:disabled {
		cursor: inherit;
	}
	@media (forced-colors: active) {
		div {
			border-color: ButtonText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		div:has(input:focus) {
			outline: 2px solid Highlight;
			outline-offset: 2px;
			box-shadow: none;
		}
	}
</style>
