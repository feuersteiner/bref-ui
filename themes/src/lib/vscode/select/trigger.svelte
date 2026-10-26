<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import { surface } from '../theme/surface.js';
	import type { SelectTriggerProps } from 'bref-ui/types';

	let { id, open, selected, placeholder, disabled, onToggle, size }: SelectTriggerProps = $props();
</script>

<button {id} type="button" data-size={size} {disabled} aria-expanded={open} onclick={onToggle}>
	<span data-trigger-surface class={surface({ variant: 'neutral', color: 'foreground' })}>
		{#if selected.length === 1 && selected[0].icon}
			<span data-icon><Icon {...selected[0].icon} /></span>
		{/if}
		<span data-value data-placeholder={selected.length === 0 || undefined}>
			{selected.length ? selected.map((item) => item.label).join(', ') : placeholder}
		</span>
		<span data-icon data-chevron><Icon name="keyboard_arrow_down" /></span>
	</span>
</button>

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
	}

	[data-trigger-surface] {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		border-radius: inherit;
	}

	button {
		box-sizing: border-box;
		display: flex;
		width: 100%;
		height: var(--internal-height);
		padding: 0;
		border: 0;
		border-radius: 0.625rem;
		background: light-dark(
			color-mix(in srgb, var(--color-foreground) 6%, var(--color-background)),
			color-mix(in srgb, var(--color-foreground) 10%, var(--color-background))
		);
		color: var(--color-foreground);
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition: background-color 150ms ease;
	}
	span:first-child {
		margin-inline-start: var(--internal-padding);
	}
	span:last-child {
		margin-inline-end: var(--internal-padding);
	}
	span + span {
		margin-inline-start: 0.6rem;
	}
	[data-value] {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1rem;
		font-weight: 200;
		line-height: 1.4;
	}
	[data-placeholder] {
		color: color-mix(in srgb, var(--color-muted) 90%, var(--color-foreground));
	}
	[data-icon] {
		color: var(--color-muted);
	}
	[data-icon] {
		display: inline-flex;
		flex: 0 0 auto;
		font-size: var(--internal-icon-size);
	}
	button:hover:not(:disabled) {
		background: light-dark(
			color-mix(in srgb, var(--color-foreground) 8%, var(--color-background)),
			color-mix(in srgb, var(--color-foreground) 12%, var(--color-background))
		);
	}
	[data-chevron] {
		transition: transform 150ms ease;
	}
	button[aria-expanded='true'] [data-chevron] {
		transform: rotate(180deg);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	@media (prefers-reduced-motion: reduce) {
		button,
		[data-chevron] {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button:focus-visible {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline-color: var(--color-primary);
		outline-offset: 2px;
	}
	.bref-surface {
		--surface-border: var(--vscode-border);
		--surface-soft-strength: 14%;
	}
	.bref-surface-primary.bref-surface-filled {
		--surface-fill: var(--vscode-accent);
		--surface-content: #ffffff;
	}
	button[aria-expanded]:has(> .bref-surface > [data-chevron]) {
		border-radius: 2px;
		background: var(--vscode-input);
	}
	button[aria-expanded]:has(> .bref-surface > [data-chevron]) > .bref-surface {
		border-radius: 2px;
	}
	button[aria-expanded] > .bref-surface > [data-value] {
		font-size: 13px;
		font-weight: 400;
	}
	@media (pointer: coarse) {
		button[aria-expanded]:has(> .bref-surface > [data-chevron]) {
			min-height: 44px;
		}
	}
	@media (forced-colors: active) {
		.bref-surface {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
		}
	}
	@media (forced-colors: active) {
		.bref-surface-primary.bref-surface-filled {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
		}
	}
	@media (forced-colors: active) {
		button[aria-expanded]:has(> .bref-surface > [data-chevron]) {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
		}
	}
	@media (forced-colors: active) {
		:focus-visible {
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
