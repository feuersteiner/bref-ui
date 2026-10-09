<script lang="ts">
	import { fly } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import Icon from '../icon/icon.svelte';
	import type { CheckboxProps } from './types.js';

	let { size = 'medium', checked = $bindable(), ...attributes }: CheckboxProps = $props();
</script>

<div data-checkbox data-size={size}>
	<input {...attributes} type="checkbox" bind:checked />
	{#if checked}
		<span aria-hidden="true" transition:fly|global={{ duration: 350, y: -6, easing: elasticOut }}>
			<Icon name="check" style="font-variation-settings: 'wght' 500" />
		</span>
	{/if}
</div>

<style>
	div {
		--internal-size: 1.25rem;
		--internal-tint: var(--color-foreground, black);
		--internal-strength-light: 4%;
		--internal-strength-dark: 8%;
		--internal-fill: light-dark(
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
		);
		--internal-border: color-mix(
			in srgb,
			var(--color-foreground, black) 48%,
			var(--color-background, white)
		);
		box-sizing: border-box;
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		inline-size: var(--internal-size);
		block-size: var(--internal-size);
		border: 1px solid var(--internal-border);
		border-radius: calc(var(--internal-size) * 0.2);
		background: var(--internal-fill);
		color: var(--color-foreground, black);
		font-size: calc(var(--internal-size) * 0.8);
		vertical-align: middle;
		transition:
			background-color 150ms ease,
			border-color 150ms ease,
			color 150ms ease;
	}
	input {
		position: absolute;
		z-index: 1;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}
	span {
		display: inline-flex;
		pointer-events: none;
	}
	div[data-size='x-small'] {
		--internal-size: 0.875rem;
	}
	div[data-size='small'] {
		--internal-size: 1rem;
	}
	div[data-size='large'] {
		--internal-size: 1.5rem;
	}
	div[data-size='x-large'] {
		--internal-size: 1.75rem;
	}
	div:has(input:hover:not(:disabled):not(:checked)) {
		--internal-strength-light: 8%;
		--internal-strength-dark: 12%;
	}
	div:has(input:checked) {
		--internal-tint: var(--color-primary, blue);
		--internal-strength-light: 88%;
		--internal-strength-dark: 88%;
		--internal-border: var(--internal-fill);
		color: var(--color-background, white);
	}
	div:has(input:checked:hover:not(:disabled)) {
		--internal-strength-light: 92%;
		--internal-strength-dark: 92%;
	}
	div:has(input:active:not(:disabled)) {
		--internal-strength-light: 12%;
		--internal-strength-dark: 16%;
	}
	div:has(input:checked:active:not(:disabled)) {
		--internal-strength-light: 96%;
		--internal-strength-dark: 96%;
	}
	div:has(input:user-invalid),
	div:has(input[aria-invalid='true']) {
		--internal-border: var(--color-error, #bc2436);
	}
	div:has(input:focus-visible) {
		outline: 2px solid var(--color-primary, blue);
		outline-offset: 3px;
	}
	div:has(input:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
	input:disabled {
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
		div:has(input:checked) {
			background: Highlight;
			color: HighlightText;
		}
		div:has(input:focus-visible) {
			outline: 2px solid Highlight;
			outline-offset: 3px;
		}
	}
</style>
