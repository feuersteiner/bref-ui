<script lang="ts">
	import type { ProgressProps } from 'bref-ui/types';

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
		<span
			class={['bref-glass']}
			style:inset-inline-start={`${percentage}%`}
			aria-hidden="true"
		></span>
	{/if}
</div>

<style>
	.bref-surface {
		--surface-color: var(--color-foreground, black);
		--surface-base: var(--color-background, white);
		--surface-foreground: var(--color-foreground, black);
		--surface-tint: var(--surface-color);
		--surface-soft-strength: 24%;
		--surface-neutral-strength: 2%;
		--surface-strength: var(--surface-neutral-strength);
		--surface-hover: 0%;
		--surface-fill: color-mix(in srgb, var(--surface-tint) var(--surface-strength), transparent);
		--surface-border: transparent;
		--surface-content: var(--surface-color);
		--surface-neutral-content: color-mix(
			in srgb,
			var(--surface-color) 80%,
			var(--surface-foreground)
		);
		--surface-highlight: 0 0 0 transparent;
		--surface-shadow: 0 0 0 transparent;
		box-sizing: border-box;
		border: 1px solid var(--surface-border);
		background: var(--surface-fill);
		color: var(--surface-content);
		box-shadow: var(--surface-highlight), var(--surface-shadow);
		transition:
			background-color 150ms ease,
			border-color 150ms ease,
			box-shadow 150ms ease,
			color 150ms ease;
	}
	.bref-surface-primary {
		--surface-color: var(--color-primary, blue);
	}
	.bref-surface-secondary {
		--surface-color: var(--color-secondary, purple);
	}
	.bref-surface-foreground {
		--surface-color: var(--color-foreground, black);
	}
	.bref-surface-background {
		--surface-color: var(--color-background, white);
		--surface-tint: var(--surface-foreground);
		--surface-soft-strength: 5%;
		--surface-content: inherit;
		--surface-neutral-content: inherit;
	}
	.bref-surface-muted {
		--surface-color: var(--color-muted, gray);
	}
	.bref-surface-info {
		--surface-color: var(--color-info, blue);
	}
	.bref-surface-success {
		--surface-color: var(--color-success, green);
	}
	.bref-surface-warning {
		--surface-color: var(--color-warning, brown);
	}
	.bref-surface-error {
		--surface-color: var(--color-error, red);
	}
	.bref-surface-soft {
		--surface-strength: var(--surface-soft-strength);
		--surface-fill: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-strength),
			var(--surface-base)
		);
		--surface-content: color-mix(in srgb, var(--surface-color) 80%, var(--surface-foreground));
	}
	.bref-surface-filled {
		--surface-strength: 100%;
		--surface-fill: color-mix(
			in srgb,
			var(--surface-color) var(--surface-strength),
			var(--surface-foreground)
		);
		--surface-content: var(--surface-base);
	}
	.bref-surface-background.bref-surface-filled {
		--surface-fill: color-mix(
			in srgb,
			var(--surface-base) var(--surface-strength),
			var(--surface-foreground)
		);
	}
	.bref-surface-background:is(.bref-surface-soft, .bref-surface-filled) {
		--surface-content: var(--surface-foreground);
	}
	.bref-surface-shadow-small {
		--surface-shadow: 0 2px 6px color-mix(in srgb, black 8%, transparent);
	}
	.bref-surface-shadow-medium {
		--surface-shadow: 0 0.5rem 1.5rem color-mix(in srgb, black 12%, transparent);
	}
	.bref-surface-shadow-large {
		--surface-shadow: 0 1.5rem 4rem color-mix(in srgb, black 20%, transparent);
	}
	.bref-surface-hover-small {
		--surface-hover: 2%;
	}
	.bref-surface-hover-medium {
		--surface-hover: 4%;
	}
	.bref-surface-hover-large {
		--surface-hover: 8%;
	}

	.bref-surface-soft:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:hover,
			:focus-visible,
			[data-surface-pressed='true']
		) {
		--surface-strength: calc(var(--surface-soft-strength) + var(--surface-hover));
	}

	.bref-surface-filled:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:hover,
			:focus-visible,
			[data-surface-pressed='true']
		) {
		--surface-strength: calc(100% - var(--surface-hover));
	}

	.bref-surface-neutral:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:hover,
			:focus-visible,
			[data-surface-pressed='true']
		) {
		--surface-strength: calc(var(--surface-neutral-strength) + var(--surface-hover));
		--surface-content: var(--surface-neutral-content);
	}

	.bref-surface:is(
			.bref-surface-hover-small,
			.bref-surface-hover-medium,
			.bref-surface-hover-large
		):not(:disabled, [aria-disabled='true'], [data-surface-disabled='true']):is(
			:active,
			[data-surface-pressed='true']
		) {
		--surface-hover: 8%;
	}
	.bref-surface:is(:focus-visible, [data-surface-focused='true']) {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
	}
	.bref-surface[data-surface-invalid='true'] {
		border-color: var(--color-error, red);
	}
	.bref-surface:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true']) {
		opacity: 0.45;
		cursor: not-allowed;
	}
	@media (prefers-reduced-motion: reduce) {
		.bref-surface {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		.bref-surface {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		.bref-surface:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true']) {
			color: GrayText;
			opacity: 1;
		}
		.bref-surface:is(:focus-visible, [data-surface-focused='true']) {
			outline-color: Highlight;
		}
	}

	.bref-glass {
		--glass-paint: var(--surface-fill, var(--color-background, white));
		--glass-opacity: 20%;
		--glass-blur: blur(0.75rem) saturate(120%);
	}
	.bref-glass {
		background: var(--glass-paint);
		color: var(--surface-content, var(--color-foreground, black));
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--color-foreground, black) 8%, transparent),
			var(--surface-shadow, 0 0.5rem 1.5rem color-mix(in srgb, black 12%, transparent));
	}
	.bref-glass:where(.bref-surface-neutral) {
		--glass-paint: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-strength),
			var(--surface-base)
		);
	}
	.bref-glass:where(.bref-surface-soft) {
		--glass-opacity: 40%;
	}
	.bref-glass:where(.bref-surface-filled) {
		--glass-opacity: 65%;
	}
	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.bref-glass {
			background: color-mix(in srgb, var(--glass-paint) var(--glass-opacity), transparent);
			-webkit-backdrop-filter: var(--glass-blur);
			backdrop-filter: var(--glass-blur);
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-glass {
			background: var(--glass-paint);
			box-shadow: var(--surface-shadow, 0 0 0 transparent);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-glass {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}

		.bref-glass:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true']) {
			color: GrayText;
			opacity: 1;
		}
	}

	div {
		--progress-height: 0.375rem;
		--progress-track: color-mix(in srgb, var(--color-foreground) 22%, var(--color-background));
		--progress-fill: var(--color-primary);
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
		inset-inline: 0 100%;
		height: var(--progress-height);
		border-radius: 999px;
		background: var(--progress-fill);
		animation:
			sweep-leading 2s cubic-bezier(0.15, 0, 0.45, 1) infinite,
			sweep-trailing 2s cubic-bezier(0.55, 0, 0.85, 1) infinite;
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
	div:has(input:disabled) {
		--progress-fill: var(--color-muted);
		filter: grayscale(1);
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
		--glass-paint: color-mix(in srgb, var(--color-background) 92%, var(--progress-fill));
		--surface-shadow: 0 2px 6px color-mix(in srgb, var(--color-foreground) 18%, transparent);
		box-sizing: border-box;
		position: absolute;
		top: 50%;
		width: 1.25rem;
		height: 1.25rem;
		border: 3px solid var(--progress-fill);
		border-radius: 50%;
		transform: translate(var(--internal-thumb-offset, -50%), -50%);
		transition:
			transform 150ms ease,
			box-shadow 150ms ease;
		pointer-events: none;
	}
	@media (hover: hover) {
		input:not(:disabled):hover + span {
			transform: translate(var(--internal-thumb-offset, -50%), -50%) scale(1.3);
			--surface-shadow: 0 3px 10px color-mix(in srgb, var(--color-foreground) 22%, transparent);
		}
	}
	input:not(:disabled):active + span {
		transform: translate(var(--internal-thumb-offset, -50%), -50%) scale(1.5);
		--surface-shadow:
			0 4px 14px color-mix(in srgb, var(--color-foreground) 24%, transparent),
			0 0 0 4px color-mix(in srgb, var(--progress-fill) 18%, transparent);
	}
	span:dir(rtl) {
		--internal-thumb-offset: 50%;
	}
	input:focus-visible + span {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
	@keyframes sweep-leading {
		to {
			inset-inline-end: 0;
		}
	}
	@keyframes sweep-trailing {
		to {
			inset-inline-start: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		span {
			transition: none;
		}
		div[data-unknown='true']::after {
			animation: none;
			inset-inline: 35%;
		}
	}
	@media (forced-colors: active) {
		div {
			--progress-track: Canvas;
			--progress-fill: Highlight;
		}
		div:has(input:disabled) {
			--progress-fill: GrayText;
			filter: none;
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

	.bref-surface {
		--surface-neutral-strength: 0%;
		--surface-soft-strength: 14%;
		--glassy-paint: color-mix(in srgb, var(--surface-tint) var(--surface-strength), #ffffff);
		--glassy-opacity: 40%;
		--surface-border: #ffffff80;
		--surface-highlight: inset 0 1px 0 #ffffffdd, inset 0 -1px 0 #24344210;
		--surface-shadow: 0 2px 6px #24344214;
		--glassy-ink: var(--surface-content);
	}
	.bref-surface-soft {
		--glassy-opacity: 56%;
		--surface-border: #ffffff99;
	}
	.bref-surface-filled {
		--glassy-paint: var(--surface-fill);
		--glassy-opacity: 100%;
		--surface-border: #ffffff22;
		--glassy-ink: #ffffff;
		--surface-highlight: inset 0 1px 0 #ffffff30;
	}
	.bref-surface-background {
		--surface-tint: var(--color-foreground);
		--surface-soft-strength: 4%;
		--glassy-ink: var(--color-foreground);
	}
	.bref-surface-background.bref-surface-filled {
		--surface-highlight: inset 0 1px 0 #ffffff;
	}
	.bref-surface {
		background: var(--glassy-paint, #f5f6f7);
		color: var(--glassy-ink, var(--color-foreground));
		box-shadow: var(--surface-highlight), var(--surface-shadow);
	}
	.bref-glass {
		background: var(--glassy-paint, #f5f6f7);
		color: var(--glassy-ink, var(--color-foreground));
		box-shadow: var(--surface-highlight, 0 0 0 transparent), var(--surface-shadow);
	}
	[data-surface] {
		--surface-shadow: 0 12px 36px -16px #24344240;
	}
	.bref-surface-shadow-small {
		--surface-shadow: 0 4px 12px -4px #24344220;
	}
	.bref-surface-shadow-medium {
		--surface-shadow: 0 12px 32px -12px #24344230;
	}
	.bref-surface-shadow-large {
		--surface-shadow: 0 24px 64px -20px #24344238;
	}
	[data-unknown] {
		--progress-track: color-mix(in srgb, var(--color-foreground) 12%, transparent);
	}
	[data-seekable] > .bref-glass {
		--glassy-paint: #ffffff;
		--glassy-opacity: 90%;
		border-width: 2px;
	}
	progress {
		box-shadow: none;
	}
	[data-seekable]:has(input:disabled) {
		--progress-fill: #a0aeb9;
		filter: none;
	}
	:focus-visible:not(input):not(textarea) {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.bref-surface {
			background:
				linear-gradient(135deg, #ffffff20, transparent 45%, #ffffff08),
				color-mix(in srgb, var(--glassy-paint, #f5f6f7) var(--glassy-opacity, 90%), transparent);
			-webkit-backdrop-filter: blur(32px) saturate(125%);
			backdrop-filter: blur(32px) saturate(125%);
		}
	}
	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.bref-glass {
			background:
				linear-gradient(135deg, #ffffff20, transparent 45%, #ffffff08),
				color-mix(in srgb, var(--glassy-paint, #f5f6f7) var(--glassy-opacity, 90%), transparent);
			-webkit-backdrop-filter: blur(32px) saturate(125%);
			backdrop-filter: blur(32px) saturate(125%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::after {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-surface {
			background: var(--glassy-paint, #f5f6f7);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-glass {
			background: var(--glassy-paint, #f5f6f7);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-surface {
			background: Canvas;
			color: CanvasText;
			border-color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-glass {
			background: Canvas;
			color: CanvasText;
			border-color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		progress {
			background: Canvas;
			color: CanvasText;
			border-color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-surface:is(:disabled, [aria-disabled='true']) {
			color: GrayText;
		}
	}
	@media (forced-colors: active) {
		[data-seekable]:has(input:disabled) {
			--progress-fill: GrayText;
		}
	}
	@media (forced-colors: active) {
		:focus-visible:not(input):not(textarea) {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none;
			transition: none;
		}
	}
</style>
