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
		--progress-track: color-mix(in srgb, var(--color-foreground) 22%, var(--color-background));
		--progress-fill: var(--color-primary);
		--progress-highlight: color-mix(in srgb, white 35%, transparent);
		--progress-travel: 233.333%;
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
		overflow: hidden;
	}
	progress::-webkit-progress-bar {
		background: transparent;
	}
	progress::-webkit-progress-value {
		background: var(--progress-fill);
		border-radius: 999px;
	}
	progress::-moz-progress-bar {
		background: var(--progress-fill);
		border-radius: 999px;
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
		width: 30%;
		height: var(--progress-height);
		border-radius: 999px;
		background: var(--progress-fill);
		animation: sweep 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		pointer-events: none;
	}
	div:dir(rtl) {
		--progress-travel: -233.333%;
	}
	div[data-unknown='true']:dir(rtl)::after {
		left: auto;
		right: 0;
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
		background: var(--progress-fill);
		box-shadow:
			inset 0 1px 0 var(--progress-highlight),
			0 2px 6px color-mix(in srgb, black 18%, transparent);
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
				0 3px 10px color-mix(in srgb, black 22%, transparent);
		}
	}
	input:not(:disabled):active + span {
		transform: translate(var(--internal-thumb-offset, -50%), -50%) scale(1.5);
		box-shadow:
			inset 0 1px 0 var(--progress-highlight),
			0 4px 14px color-mix(in srgb, black 24%, transparent),
			0 0 0 4px color-mix(in srgb, var(--color-primary) 18%, transparent);
	}
	span:dir(rtl) {
		--internal-thumb-offset: 50%;
	}
	input:focus-visible + span {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
	input:disabled + span {
		opacity: 0.5;
	}
	@keyframes sweep {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(var(--progress-travel));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		span {
			transition: none;
		}
		div[data-unknown='true']::after {
			animation: none;
			transform: translateX(calc(var(--progress-travel) / 2));
		}
	}
	@media (forced-colors: active) {
		div {
			--progress-track: Canvas;
			--progress-fill: Highlight;
		}
		div[data-unknown='true']::after {
			forced-color-adjust: none;
		}
		input:focus-visible + span {
			outline-color: Highlight;
		}
		progress {
			forced-color-adjust: none;
			border: 1px solid CanvasText;
			box-shadow: none;
		}
		span {
			background: Highlight;
			border: 1px solid HighlightText;
			box-shadow: none;
		}
	}
</style>
