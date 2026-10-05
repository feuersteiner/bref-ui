<script lang="ts">
	/* eslint-disable max-lines -- Keep the authoritative surface paint and state recipes together. */
</script>

<style>
	:global(.surface) {
		--surface-color: var(--color-foreground, black);
		--surface-base: var(--color-background, white);
		--surface-foreground: var(--color-foreground, black);
		--surface-strength: 0%;
		--surface-hover: 0%;
		--surface-fill: transparent;
		--surface-border: transparent;
		--surface-content: var(--surface-color);
		--surface-neutral-content: color-mix(
			in srgb,
			var(--surface-color) 80%,
			var(--surface-foreground)
		);
		--surface-highlight: 0 0 0 transparent;
		--surface-shadow: 0 0 0 transparent;
		--surface-glow: 0 0 0 transparent;
		--surface-glow-size: 0;
		--surface-blur: none;
		box-sizing: border-box;
		border: 1px solid var(--surface-border);
		background: var(--surface-fill);
		color: var(--surface-content);
		box-shadow: var(--surface-highlight), var(--surface-shadow), var(--surface-glow);
		-webkit-backdrop-filter: var(--surface-blur);
		backdrop-filter: var(--surface-blur);
		transition:
			background-color 150ms ease,
			border-color 150ms ease,
			box-shadow 150ms ease,
			color 150ms ease;
	}
	:global(.surface:is(button, a, [role='button'])) {
		cursor: pointer;
	}
	:global(.surface-primary) {
		--surface-color: var(--color-primary, blue);
	}
	:global(.surface-secondary) {
		--surface-color: var(--color-secondary, purple);
	}
	:global(.surface-foreground) {
		--surface-color: var(--color-foreground, black);
	}
	:global(.surface-background) {
		--surface-color: var(--color-background, white);
		--surface-content: inherit;
		--surface-neutral-content: inherit;
	}
	:global(.surface-muted) {
		--surface-color: var(--color-muted, gray);
	}
	:global(.surface-info) {
		--surface-color: var(--color-info, blue);
	}
	:global(.surface-success) {
		--surface-color: var(--color-success, green);
	}
	:global(.surface-warning) {
		--surface-color: var(--color-warning, brown);
	}
	:global(.surface-error) {
		--surface-color: var(--color-error, red);
	}
	:global(.surface-soft),
	:global(.surface-filled) {
		--surface-fill: color-mix(
			in srgb,
			var(--surface-color) var(--surface-strength),
			var(--surface-base)
		);
		--surface-highlight: inset 0 1px 0
			color-mix(in srgb, var(--surface-foreground) 16%, transparent);
	}
	:global(.surface-soft) {
		--surface-strength: 16%;
		--surface-fill: color-mix(
			in srgb,
			color-mix(in srgb, var(--surface-color) var(--surface-strength), var(--surface-base)) 85%,
			transparent
		);
		--surface-border: color-mix(in srgb, var(--surface-color) 30%, transparent);
		--surface-content: color-mix(in srgb, var(--surface-color) 80%, var(--surface-foreground));
		--surface-blur: blur(0.5rem) saturate(120%);
	}
	:global(.surface-filled) {
		--surface-strength: 100%;
		--surface-fill: color-mix(
			in srgb,
			var(--surface-color) var(--surface-strength),
			var(--surface-foreground)
		);
		--surface-border: color-mix(in srgb, var(--surface-color) 68%, var(--surface-foreground));
		--surface-content: var(--surface-base);
		--surface-highlight: inset 0 1px 0
			color-mix(in srgb, var(--surface-foreground) 28%, transparent);
	}
	:global(.surface-background:is(.surface-soft, .surface-filled)) {
		--surface-content: var(--surface-foreground);
	}
	:global(.surface-shadow-small) {
		--surface-shadow: 0 2px 6px color-mix(in srgb, var(--surface-foreground) 8%, transparent);
	}
	:global(.surface-shadow-medium) {
		--surface-shadow: 0 0.5rem 1.5rem color-mix(in srgb, var(--surface-foreground) 12%, transparent);
	}
	:global(.surface-shadow-large) {
		--surface-shadow: 0 1.5rem 4rem color-mix(in srgb, var(--surface-foreground) 20%, transparent);
	}
	:global(.surface-hover-small) {
		--surface-hover: 2%;
		--surface-glow-size: 0.5rem;
	}
	:global(.surface-hover-medium) {
		--surface-hover: 4%;
		--surface-glow-size: 1rem;
	}
	:global(.surface-hover-large) {
		--surface-hover: 8%;
		--surface-glow-size: 1.5rem;
	}
	:global(
		.surface:is(.surface-hover-small, .surface-hover-medium, .surface-hover-large):not(
				:disabled,
				[aria-disabled='true'],
				[data-surface-disabled='true']
			):is(:hover, :focus-visible, [data-surface-pressed='true'])
	) {
		--surface-glow: 0 0 var(--surface-glow-size)
			color-mix(in srgb, var(--surface-color) 10%, transparent);
		--surface-border: color-mix(in srgb, var(--surface-color) 40%, transparent);
	}
	:global(
		.surface-soft:is(.surface-hover-small, .surface-hover-medium, .surface-hover-large):not(
				:disabled,
				[aria-disabled='true'],
				[data-surface-disabled='true']
			):is(:hover, :focus-visible, [data-surface-pressed='true'])
	) {
		--surface-strength: calc(16% + var(--surface-hover));
	}
	:global(
		.surface-filled:is(.surface-hover-small, .surface-hover-medium, .surface-hover-large):not(
				:disabled,
				[aria-disabled='true'],
				[data-surface-disabled='true']
			):is(:hover, :focus-visible, [data-surface-pressed='true'])
	) {
		--surface-strength: calc(100% - var(--surface-hover));
	}
	:global(
		.surface-neutral:is(.surface-hover-small, .surface-hover-medium, .surface-hover-large):not(
				:disabled,
				[aria-disabled='true'],
				[data-surface-disabled='true']
			):is(:hover, :focus-visible, [data-surface-pressed='true'])
	) {
		--surface-fill: color-mix(in srgb, var(--surface-color) var(--surface-hover), transparent);
		--surface-content: var(--surface-neutral-content);
	}
	:global(
		.surface:is(.surface-hover-small, .surface-hover-medium, .surface-hover-large):not(
				:disabled,
				[aria-disabled='true'],
				[data-surface-disabled='true']
			):is(:active, [data-surface-pressed='true'])
	) {
		--surface-hover: 8%;
	}
	:global(.surface:is(:focus-visible, [data-surface-focused='true'])) {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
	}
	:global(.surface[data-surface-invalid='true']) {
		border-color: var(--color-error, red);
	}
	:global(.surface:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true'])) {
		opacity: 0.45;
		cursor: not-allowed;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.surface) {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		:global(.surface) {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		:global(.surface:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true'])) {
			color: GrayText;
			opacity: 1;
		}
		:global(.surface:is(:focus-visible, [data-surface-focused='true'])) {
			outline-color: Highlight;
		}
	}
</style>
