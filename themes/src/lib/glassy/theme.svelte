<script lang="ts">
	import type { Snippet } from 'svelte';
	import './theme/fonts.css';
	import '@fontsource-variable/inter/index.css';
	let { children }: { children?: Snippet } = $props();
</script>

<div data-bref-theme="glassy">{@render children?.()}</div>

<style>
	[data-bref-theme] {
		color-scheme: light;
		--color-primary-light: #0068d9;
		--color-primary-dark: #0068d9;
		--color-primary: light-dark(var(--color-primary-light), var(--color-primary-dark));
		--color-secondary-light: #716282;
		--color-secondary-dark: #716282;
		--color-secondary: light-dark(var(--color-secondary-light), var(--color-secondary-dark));
		--color-background-light: #f5f6f7;
		--color-background-dark: #f5f6f7;
		--color-background: light-dark(var(--color-background-light), var(--color-background-dark));
		--color-foreground-light: #20262e;
		--color-foreground-dark: #20262e;
		--color-foreground: light-dark(var(--color-foreground-light), var(--color-foreground-dark));
		--color-muted-light: #586470;
		--color-muted-dark: #586470;
		--color-muted: light-dark(var(--color-muted-light), var(--color-muted-dark));
		--color-info-light: #256a94;
		--color-info-dark: #256a94;
		--color-info: light-dark(var(--color-info-light), var(--color-info-dark));
		--color-success-light: #237653;
		--color-success-dark: #237653;
		--color-success: light-dark(var(--color-success-light), var(--color-success-dark));
		--color-warning-light: #8e651e;
		--color-warning-dark: #8e651e;
		--color-warning: light-dark(var(--color-warning-light), var(--color-warning-dark));
		--color-error-light: #b33847;
		--color-error-dark: #b33847;
		--color-error: light-dark(var(--color-error-light), var(--color-error-dark));
		--font-display: -apple-system, BlinkMacSystemFont, 'Inter Variable', sans-serif;
		--font-text: 'Inter Variable', sans-serif;
		font:
			400 14px / 1.6 'Inter Variable',
			sans-serif;
		font-family: -apple-system, BlinkMacSystemFont, 'Inter Variable', sans-serif;
		display: block;
		min-width: 0;
		min-height: 100%;
		background:
			radial-gradient(ellipse at 8% 12%, #8fabbc66, transparent 58%),
			radial-gradient(ellipse at 95% 65%, #c1b5a466, transparent 56%),
			linear-gradient(135deg, #dbe5eb, #eef0ed 48%, #c7d7df);
		color: var(--color-foreground);
		font-synthesis: none;
	}
</style>
