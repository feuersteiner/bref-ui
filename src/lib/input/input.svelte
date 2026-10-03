<script lang="ts">
	/* eslint-disable max-lines -- Native input and textarea share one scoped style recipe. */
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
	import type { InputProps } from './types.js';

	let {
		value = $bindable(),
		onChange,
		placeholder,
		icon,
		size = 'medium',
		disabled = false,
		multiline = false,
		resizable = true,
		rows,
		wide = false,
		variant = 'neutral',
		oninput,
		defaultValue,
		...attributes
	}: InputProps = $props();
	const initialValue = value;

	const handleInput = (event: Event) => {
		onChange?.((event.currentTarget as HTMLInputElement | HTMLTextAreaElement).value);
		(oninput as ((event: Event) => void) | undefined)?.(event);
	};
</script>

<div data-size={size} data-variant={variant} data-wide={wide || undefined}>
	{#if icon}
		{#key icon.name}
			<span in:fly|global={{ delay: 100, duration: 200, x: -6 }}>
				<Icon {...icon} label={undefined} />
			</span>
		{/key}
	{/if}
	{#if multiline}
		<textarea
			{...attributes as HTMLTextareaAttributes}
			{placeholder}
			{disabled}
			{rows}
			defaultValue={defaultValue ?? initialValue}
			bind:value={() => value, (next) => (value = next)}
			oninput={handleInput}
			data-resizable={resizable}></textarea>
	{:else}
		<input
			{...attributes as HTMLInputAttributes}
			{placeholder}
			{disabled}
			defaultValue={defaultValue ?? initialValue}
			bind:value={() => value, (next) => (value = next == null ? '' : String(next))}
			oninput={handleInput}
		/>
	{/if}
</div>

<style>
	div {
		--internal-height: 2.5rem;
		--internal-padding: 0.85rem;
		--internal-icon-size: 1.25rem;
		--internal-tint: var(--color-foreground, black);
		--internal-strength-light: 3%;
		--internal-strength-dark: 3%;
		--internal-opacity: 15%;
		--internal-border: transparent;
		--internal-highlight: color-mix(in srgb, var(--color-foreground, black) 12%, transparent);
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		align-self: start;
		gap: 0.6rem;
		width: min(100%, 18rem);
		min-width: 0;
		max-width: 100%;
		min-height: var(--internal-height);
		padding-inline: var(--internal-padding);
		border: 1px solid var(--internal-border);
		border-radius: 0.5rem;
		background: color-mix(
			in srgb,
			light-dark(
					color-mix(
						in srgb,
						var(--internal-tint) var(--internal-strength-light),
						var(--color-background, white)
					),
					color-mix(
						in srgb,
						var(--internal-tint) var(--internal-strength-dark),
						var(--color-background, white)
					)
				)
				var(--internal-opacity),
			transparent
		);
		color: var(--color-foreground, black);
		transition: all 150ms ease;
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
	}
	div[data-wide] {
		width: 100%;
	}
	div[data-size='small'] {
		--internal-height: 2rem;
		--internal-padding: 0.65rem;
		--internal-icon-size: 1rem;
	}
	div[data-size='large'] {
		--internal-height: 3rem;
		--internal-padding: 1rem;
		--internal-icon-size: 1.5rem;
	}
	div[data-variant='soft'] {
		--internal-strength-light: 4%;
		--internal-strength-dark: 16%;
		--internal-opacity: 85%;
		--internal-border: light-dark(
			color-mix(in srgb, var(--color-foreground, black) 12%, transparent),
			color-mix(in srgb, var(--color-foreground, black) 30%, transparent)
		);
		box-shadow: inset 0 1px 0 var(--internal-highlight);
	}
	div:has(textarea) {
		align-items: flex-start;
		padding-block: 0.65rem;
	}
	span {
		display: inline-flex;
		flex: 0 0 auto;
		color: var(--color-muted, #666);
		font-size: var(--internal-icon-size);
		pointer-events: none;
	}
	div:has(textarea) span {
		padding-top: 0.1rem;
	}
	input,
	textarea {
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
		line-height: 1.4;
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
	textarea {
		resize: vertical;
	}
	textarea[data-resizable='false'] {
		resize: none;
	}
	input::placeholder,
	textarea::placeholder {
		color: var(--color-muted, #666);
	}
	div[data-variant='soft']:hover:not(:has(:disabled)) {
		--internal-border: light-dark(
			color-mix(in srgb, var(--color-foreground, black) 18%, transparent),
			color-mix(in srgb, var(--color-foreground, black) 38%, transparent)
		);
		--internal-strength-light: 6%;
		--internal-strength-dark: 20%;
	}
	div:has(input:focus, textarea:focus) {
		--internal-tint: var(--color-primary, blue);
		--internal-strength-light: 6%;
		--internal-strength-dark: 12%;
		--internal-border: color-mix(in srgb, var(--internal-tint) 55%, transparent);
		box-shadow:
			inset 0 1px 0 var(--internal-highlight),
			0 0 0 3px color-mix(in srgb, var(--internal-tint) 16%, transparent);
	}
	div:has(input:invalid, textarea:invalid, [aria-invalid='true']) {
		--internal-tint: var(--color-error, #bc2436);
		--internal-border: color-mix(in srgb, var(--internal-tint) 65%, transparent);
	}
	div:has(:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
	input:disabled,
	textarea:disabled {
		cursor: inherit;
	}
	@media (prefers-reduced-motion: reduce) {
		div {
			transition: none;
		}
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
		div:has(input:focus, textarea:focus) {
			outline: 2px solid Highlight;
			outline-offset: 2px;
			box-shadow: none;
		}
	}
</style>
