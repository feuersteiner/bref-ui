<style>
	:global(:root) {
		--font-sans:
			ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	:global(body) {
		background: var(--color-background);
		color: var(--color-foreground);
		font-family: var(--font-text, var(--font-sans));
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: color-mix(in srgb, var(--color-muted) 60%, transparent) transparent;
	}

	@supports selector(::-webkit-scrollbar) {
		:global(*) {
			scrollbar-width: auto;
			scrollbar-color: auto;
		}
		:global(::-webkit-scrollbar) {
			width: 8px;
			height: 8px;
		}
		:global(::-webkit-scrollbar-track),
		:global(::-webkit-scrollbar-corner) {
			background: transparent;
		}
		:global(::-webkit-scrollbar-thumb) {
			border: 2px solid transparent;
			border-radius: 999px;
			background: color-mix(in srgb, var(--color-muted) 60%, transparent);
			background-clip: padding-box;
		}
		:global(::-webkit-scrollbar-thumb:hover) {
			background-color: var(--color-primary);
		}
	}

	@media (forced-colors: active) {
		:global(*) {
			scrollbar-color: auto;
		}
		:global(::-webkit-scrollbar-thumb) {
			background-color: CanvasText;
		}
	}
</style>
