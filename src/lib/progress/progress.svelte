<script lang="ts">
	/* eslint-disable max-lines -- Keep the native progress and seek recipes together. */
	import type { ProgressProps } from './types.js';

	let {
		label,
		id,
		title,
		'aria-label': ariaLabel,
		'aria-describedby': describedBy,
		'aria-labelledby': labelledBy,
		value,
		size = 'medium',
		onSeek,
		disabled = false,
		oninput,
		onchange,
		onpointercancel,
		...attributes
	}: ProgressProps = $props();

	const checkedValue = $derived.by(() => {
		if (value === undefined) return undefined;
		if (!Number.isFinite(value)) throw new RangeError('Progress value must be finite');
		return Math.min(1, Math.max(0, value));
	});
	const seekable = $derived(onSeek !== undefined);
	let draft = $state<number | undefined>(undefined);
	const display = $derived(draft ?? checkedValue ?? 0);
	const percentage = $derived(display * 100);

	const handleInput = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		oninput?.(event);
		if (disabled || !onSeek) return;
		draft = Math.min(1, Math.max(0, (event.currentTarget as HTMLInputElement).valueAsNumber));
		onSeek(draft);
	};

	const handleChange = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		draft = undefined;
		onchange?.(event);
	};
</script>

<div data-size={size} data-seekable={seekable} data-unknown={checkedValue === undefined}>
	<progress
		{...seekable ? {} : { ...attributes, oninput, onchange, onpointercancel }}
		id={seekable ? undefined : id}
		title={seekable ? undefined : title}
		aria-describedby={seekable ? undefined : describedBy}
		aria-labelledby={seekable ? undefined : labelledBy}
		aria-label={seekable ? undefined : label || ariaLabel}
		aria-hidden={seekable ? 'true' : undefined}
		max="1"
		value={checkedValue}
	></progress>
	{#if seekable}
		<input
			{...attributes}
			type="range"
			{id}
			{title}
			aria-describedby={describedBy}
			aria-labelledby={labelledBy}
			min="0"
			max="1"
			step="0.01"
			value={display}
			aria-label={label || ariaLabel}
			{disabled}
			oninput={handleInput}
			onchange={handleChange}
			onpointercancel={(event) => {
				draft = undefined;
				onpointercancel?.(event);
			}}
		/>
		<span style:inset-inline-start={`${percentage}%`} aria-hidden="true"></span>
	{/if}
</div>

<style>
	div {
		--progress-height: 0.375rem;
		--progress-track: color-mix(
			in srgb,
			color-mix(in srgb, var(--color-foreground) 16%, var(--color-background)) 85%,
			transparent
		);
		--progress-fill: color-mix(
			in srgb,
			color-mix(in srgb, var(--color-primary) 88%, var(--color-background)) 85%,
			transparent
		);
		--progress-highlight: color-mix(in srgb, var(--color-foreground) 28%, transparent);
		position: relative;
		display: block;
		width: 100%;
		min-width: 0;
	}
	div[data-size='small'] {
		--progress-height: 0.25rem;
	}
	div[data-size='large'] {
		--progress-height: 0.5rem;
	}
	progress {
		display: block;
		width: 100%;
		height: var(--progress-height);
		border: 0;
		border-radius: 999px;
		appearance: none;
		background: var(--progress-track);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--color-foreground) 16%, transparent),
			0 2px 6px color-mix(in srgb, var(--color-foreground) 8%, transparent);
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
		overflow: hidden;
	}
	progress::-webkit-progress-bar {
		background: transparent;
	}
	progress::-webkit-progress-value {
		background: var(--progress-fill);
		border-radius: 999px;
		box-shadow: inset 0 1px 0 var(--progress-highlight);
	}
	progress::-moz-progress-bar {
		background: var(--progress-fill);
		border-radius: 999px;
		box-shadow: inset 0 1px 0 var(--progress-highlight);
	}
	div[data-unknown='true'] progress::-webkit-progress-value {
		background: transparent;
	}
	div[data-unknown='true'] progress::-moz-progress-bar {
		background: transparent;
	}
	div[data-unknown='true']::after {
		content: '';
		position: absolute;
		top: calc(50% - var(--progress-height) / 2);
		left: 0;
		width: 100%;
		height: var(--progress-height);
		border-radius: 999px;
		background: var(--progress-fill);
		box-shadow: inset 0 1px 0 var(--progress-highlight);
		transform-origin: left center;
		animation: sweep 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		pointer-events: none;
	}
	div[data-seekable='true'] {
		min-height: 2.75rem;
		display: flex;
		align-items: center;
	}
	div[data-seekable='true'] progress {
		pointer-events: none;
	}
	input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
		touch-action: none;
	}
	input:disabled {
		cursor: not-allowed;
	}
	span {
		box-sizing: border-box;
		position: absolute;
		top: 50%;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--color-background) 25%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-foreground) 30%, transparent);
		box-shadow:
			inset 0 1px 0 var(--progress-highlight),
			0 2px 6px color-mix(in srgb, var(--color-foreground) 12%, transparent);
		-webkit-backdrop-filter: blur(0.125rem) saturate(120%);
		backdrop-filter: blur(0.125rem) saturate(120%);
		transform: translate(var(--internal-thumb-offset, -50%), -50%);
		transition:
			transform 150ms ease,
			box-shadow 150ms ease;
		pointer-events: none;
	}
	@media (hover: hover) {
		input:not(:disabled):hover + span {
			transform: translate(var(--internal-thumb-offset, -50%), -50%) scale(1.3);
			box-shadow:
				inset 0 1px 0 var(--progress-highlight),
				0 3px 10px color-mix(in srgb, var(--color-foreground) 20%, transparent);
		}
	}
	input:not(:disabled):active + span {
		transform: translate(var(--internal-thumb-offset, -50%), -50%) scale(1.5);
		box-shadow:
			inset 0 1px 0 var(--progress-highlight),
			0 4px 14px color-mix(in srgb, var(--color-foreground) 24%, transparent),
			0 0 0 4px color-mix(in srgb, var(--color-foreground) 12%, transparent);
	}
	span:dir(rtl) {
		--internal-thumb-offset: 50%;
	}
	input:focus-visible + span {
		outline: 2px solid var(--color-foreground);
		outline-offset: 3px;
	}
	input:disabled + span {
		opacity: 0.5;
	}
	@keyframes sweep {
		0% {
			transform: translateX(0) scaleX(0);
		}
		50% {
			transform: translateX(25%) scaleX(0.5);
		}
		100% {
			transform: translateX(100%) scaleX(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		span {
			transition: none;
		}
		div[data-unknown='true']::after {
			animation: none;
			transform: translateX(32.5%) scaleX(0.35);
		}
	}
	@media (forced-colors: active) {
		progress {
			border: 1px solid CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		span {
			background: Highlight;
			border-color: HighlightText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
</style>
