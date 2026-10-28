<script lang="ts">
	import { appearanceMotion } from '../theme/overlay-motion.js';
	import { elasticOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import Icon from '../icon/icon.svelte';
	import type { CheckboxProps } from './types.js';

	let { size = 'medium', checked = $bindable(), ...attributes }: CheckboxProps = $props();
</script>

<div data-checkbox data-size={size}>
	<input {...attributes} type="checkbox" bind:checked />
	{#if checked}
		<span
			aria-hidden="true"
			transition:appearanceMotion={{
				duration: prefersReducedMotion.current ? 0 : 350,
				y: prefersReducedMotion.current ? 0 : -6,
				easing: elasticOut
			}}
		>
			<Icon name="check" style="font-variation-settings: 'wght' 500" />
		</span>
	{/if}
</div>

<style>
	div {
		--internal-size: 1.25rem;
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
		border-radius: 3px;
		background: var(--crystal-code-input);
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
	div:has(input:checked) {
		--internal-border: var(--color-primary);
		background: var(--color-primary);
		color: var(--crystal-code-on-primary);
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
		}
		div:has(input:checked) {
			background: Highlight;
			color: HighlightText;
		}
		div:has(input:focus-visible) {
			outline-color: Highlight;
		}
	}
</style>
