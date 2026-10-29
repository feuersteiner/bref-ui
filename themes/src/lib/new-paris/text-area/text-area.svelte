<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import { surface } from '../theme/surface.js';
	import type { TextAreaProps } from 'bref-ui/types';

	let {
		value = $bindable(),
		onChange,
		icon,
		size = 'medium',
		wide = false,
		variant = 'soft',
		glass = false,
		resizable = true,
		oninput,
		defaultValue,
		...attributes
	}: TextAreaProps = $props();
	const initialValue = value;

	const handleInput = (event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }) => {
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
	<textarea
		{...attributes}
		defaultValue={defaultValue ?? initialValue}
		bind:value={() => value, (next) => (value = next)}
		oninput={handleInput}
		data-resizable={resizable}></textarea>
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
		--internal-height: 2.5rem;
		--internal-padding: 1rem;
		--internal-icon-size: 1.25rem;
		--internal-placeholder: color-mix(in srgb, var(--color-muted,) 35%, var(--color-foreground));
		box-sizing: border-box;
		display: inline-flex;
		align-items: flex-start;
		align-self: start;
		gap: 0.625rem;
		width: min(100%, 18rem);
		min-width: 0;
		max-width: 100%;
		min-height: var(--internal-height);
		padding-inline: var(--internal-padding);
		padding-block: 0.75rem;
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
		padding-top: 0.1rem;
		pointer-events: none;
	}
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
		line-height: 1.5;
	}
	textarea {
		resize: vertical;
	}
	textarea[data-resizable='false'] {
		resize: none;
	}
	textarea::placeholder {
		color: var(--internal-placeholder);
		opacity: 1;
	}
	div:has(textarea:focus) {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	div:has(textarea:user-invalid, textarea[aria-invalid='true']) {
		--surface-border: var(--color-error);
		outline-color: var(--color-error);
	}
	div:has(:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
	div[data-variant='soft']:has(textarea:disabled):hover {
		--surface-strength: var(--surface-soft-strength);
	}
	textarea:disabled {
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
		div:has(textarea:focus) {
			outline: 2px solid Highlight;
			outline-offset: 2px;
			box-shadow: none;
		}
	}

	.bref-surface {
		border-radius: 0;
	}
	.bref-surface {
		--surface-soft-strength: 7%;
		--surface-neutral-strength: 0%;
		--surface-border: var(--np-rule);
		--surface-highlight: 0 0 0 transparent;
	}
	.bref-surface-filled {
		--surface-border: var(--surface-color);
	}
	.bref-surface-soft {
		--surface-border: transparent;
	}
	.bref-surface:is(
		.bref-surface-shadow-small,
		.bref-surface-shadow-medium,
		.bref-surface-shadow-large
	) {
		--surface-shadow: 0 12px 36px color-mix(in srgb, var(--color-foreground) 9%, transparent);
	}
	.bref-glass {
		background: var(--np-paper);
		box-shadow: var(--surface-shadow);
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
	}
	textarea {
		font-weight: 400;
	}
	[data-size] > textarea {
		font-size: 1rem;
	}
	[data-size='small'] > textarea {
		font-size: 0.875rem;
	}
	[data-size='large'] > textarea {
		font-size: 1.125rem;
	}
	.bref-surface:has(> textarea) {
		background: var(--np-paper);
		--surface-border: var(--np-rule);
	}
	:focus-visible:not(textarea) {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	.bref-surface:has(> textarea:focus-visible) {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	.bref-surface:has(> textarea[aria-invalid='true']) {
		--surface-border: var(--color-error);
		outline-color: var(--color-error);
	}
	@media (forced-colors: active) {
		.bref-surface {
			background: Canvas;
			color: CanvasText;
			border-color: CanvasText;
			box-shadow: none;
		}
	}
	@media (forced-colors: active) {
		.bref-glass {
			background: Canvas;
			color: CanvasText;
			border-color: CanvasText;
			box-shadow: none;
		}
	}
	@media (forced-colors: active) {
		:focus-visible:not(textarea) {
			outline-color: Highlight;
		}
	}
	@media (forced-colors: active) {
		.bref-surface:has(> textarea:focus-visible) {
			outline-color: Highlight;
		}
	}

	:focus-visible:not(textarea) {
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
