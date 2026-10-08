<style>
	:global(.glass) {
		--glass-paint: var(--surface-fill, var(--color-background, white));
		--glass-opacity: 72%;
		--glass-blur: blur(1.125rem) saturate(110%);
	}
	/* Three class selectors keep opt-in material above ordinary scoped component paint.
	   Inline styles and explicit selectors can still override it. */
	:global(.glass.glass.glass) {
		background: var(--glass-paint);
		color: var(--surface-content, var(--color-foreground, black));
		box-shadow:
			inset 0 1px 0 var(--edge-highlight, rgb(255 255 255 / 45%)),
			var(
				--surface-shadow,
				0 0.5rem 1.5rem color-mix(in srgb, var(--shadow-color, #000) 12%, transparent)
			);
	}
	:global(.glass:where(.surface-neutral)) {
		--glass-paint: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-hover),
			var(--surface-base)
		);
	}
	:global(.glass:where(.surface-filled)) {
		--glass-opacity: 92%;
	}
	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		:global(.glass.glass.glass) {
			background: color-mix(in srgb, var(--glass-paint) var(--glass-opacity), transparent);
			-webkit-backdrop-filter: var(--glass-blur);
			backdrop-filter: var(--glass-blur);
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		:global(.glass.glass.glass) {
			background: var(--glass-paint);
			box-shadow: var(--surface-shadow, 0 0 0 transparent);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		:global(.glass.glass.glass) {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		:global(
			.glass.glass.glass:is(:disabled, [aria-disabled='true'], [data-surface-disabled='true'])
		) {
			color: GrayText;
			opacity: 1;
		}
	}
</style>
