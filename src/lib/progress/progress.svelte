<script lang="ts">
	/* eslint-disable max-lines, svelte/consistent-selector-style -- Keep the native progress and seek recipes together. */
	import type { ProgressProps } from './types.js';

	let {
		label,
		id,
		title,
		'aria-describedby': describedBy,
		'aria-labelledby': labelledBy,
		value,
		max = 1,
		size = 'medium',
		color = 'primary',
		ref = $bindable(null),
		onSeek,
		onSeekCommit,
		disabled = false,
		...attributes
	}: ProgressProps = $props();

	const checkedMax = $derived.by(() => {
		if (!Number.isFinite(max) || max <= 0)
			throw new RangeError('Progress max must be finite and greater than zero');
		return max;
	});
	const checkedValue = $derived.by(() => {
		const limit = checkedMax;
		if (value === undefined) return undefined;
		if (!Number.isFinite(value)) throw new RangeError('Progress value must be finite');
		return Math.min(limit, Math.max(0, value));
	});
	const seekable = $derived(onSeek !== undefined);
	let draft = $state<number | undefined>(undefined);
	const display = $derived(draft ?? checkedValue ?? 0);
	const percentage = $derived((display / checkedMax) * 100);

	const handleInput = (event: Event) => {
		if (disabled || !onSeek) return;
		draft = (event.currentTarget as HTMLInputElement).valueAsNumber;
		onSeek(draft);
	};

	const handleChange = () => {
		if (draft === undefined) return;
		const committed = draft;
		draft = undefined;
		if (!disabled) onSeekCommit?.(committed);
	};
</script>

<div
	class="progress"
	data-size={size}
	data-seekable={seekable}
	data-unknown={checkedValue === undefined}
	style:--progress-color={`var(--color-${color})`}
>
	<progress
		{...attributes}
		bind:this={ref}
		id={seekable ? undefined : id}
		title={seekable ? undefined : title}
		aria-describedby={seekable ? undefined : describedBy}
		aria-labelledby={seekable ? undefined : labelledBy}
		aria-label={seekable ? undefined : label}
		aria-hidden={seekable ? 'true' : undefined}
		max={checkedMax}
		value={checkedValue}
	></progress>
	{#if seekable}
		<input
			type="range"
			{id}
			{title}
			aria-describedby={describedBy}
			aria-labelledby={labelledBy}
			min="0"
			max={checkedMax}
			step={checkedMax / 100}
			value={display}
			aria-label={label}
			{disabled}
			oninput={handleInput}
			onchange={handleChange}
			onpointercancel={() => (draft = undefined)}
		/>
		<span class="thumb" style:left={`${percentage}%`} aria-hidden="true"></span>
	{/if}
</div>

<style>
	.progress {
		--progress-height: 0.375rem;
		position: relative;
		display: block;
		width: 100%;
		min-width: 0;
	}
	.progress[data-size='small'] {
		--progress-height: 0.25rem;
	}
	.progress[data-size='large'] {
		--progress-height: 0.5rem;
	}
	progress {
		display: block;
		width: 100%;
		height: var(--progress-height);
		border: 0;
		border-radius: 999px;
		appearance: none;
		background: color-mix(in srgb, var(--color-muted) 30%, transparent);
		overflow: hidden;
	}
	progress::-webkit-progress-bar {
		background: color-mix(in srgb, var(--color-muted) 30%, transparent);
	}
	progress::-webkit-progress-value {
		background: var(--progress-color);
		border-radius: 999px;
	}
	progress::-moz-progress-bar {
		background: var(--progress-color);
		border-radius: 999px;
	}
	.progress[data-unknown='true'] progress::-webkit-progress-value {
		background: transparent;
	}
	.progress[data-unknown='true'] progress::-moz-progress-bar {
		background: transparent;
	}
	.progress[data-unknown='true']::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 35%;
		height: var(--progress-height);
		border-radius: 999px;
		background: var(--progress-color);
		animation: sweep 1.6s ease-in-out infinite alternate;
		pointer-events: none;
	}
	.progress[data-seekable='true'] {
		min-height: 2.75rem;
		display: flex;
		align-items: center;
	}
	.progress[data-seekable='true'] progress {
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
	.thumb {
		position: absolute;
		top: 50%;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: var(--progress-color);
		border: 2px solid var(--color-background);
		box-shadow: 0 0 0 1px var(--progress-color);
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
	input:focus-visible + .thumb {
		outline: 2px solid var(--color-foreground);
		outline-offset: 3px;
	}
	input:disabled + .thumb {
		opacity: 0.5;
	}
	@keyframes sweep {
		to {
			transform: translateX(185%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.progress[data-unknown='true']::after {
			animation: none;
			left: 32.5%;
		}
	}
	@media (forced-colors: active) {
		progress {
			border: 1px solid CanvasText;
		}
		.thumb {
			background: Highlight;
			border-color: HighlightText;
		}
	}
</style>
