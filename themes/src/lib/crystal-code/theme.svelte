<script lang="ts">
	import type { Snippet } from 'svelte';
	import './theme/fonts.css';

	let { children }: { children?: Snippet } = $props();
</script>

<div data-bref-theme="crystal-code">{@render children?.()}</div>

<style>
	[data-bref-theme] {
		color-scheme: light dark;
		--color-primary-light: #4e5969;
		--color-primary-dark: #8aa7f8;
		--color-primary: light-dark(var(--color-primary-light), var(--color-primary-dark));
		--color-secondary-light: #765d88;
		--color-secondary-dark: #bfb4cd;
		--color-secondary: light-dark(var(--color-secondary-light), var(--color-secondary-dark));
		--color-background-light: #f0f0ee;
		--color-background-dark: #0c0d10;
		--color-background: light-dark(var(--color-background-light), var(--color-background-dark));
		--color-foreground-light: #35373c;
		--color-foreground-dark: #d9dade;
		--color-foreground: light-dark(var(--color-foreground-light), var(--color-foreground-dark));
		--color-muted-light: #6a6d73;
		--color-muted-dark: #9fa1a8;
		--color-muted: light-dark(var(--color-muted-light), var(--color-muted-dark));
		--color-info-light: #4e5969;
		--color-info-dark: #8aa7f8;
		--color-info: light-dark(var(--color-info-light), var(--color-info-dark));
		--color-success-light: #53674c;
		--color-success-dark: #b3beac;
		--color-success: light-dark(var(--color-success-light), var(--color-success-dark));
		--color-warning-light: #816b46;
		--color-warning-dark: #cbbda8;
		--color-warning: light-dark(var(--color-warning-light), var(--color-warning-dark));
		--color-error-light: #9e5e55;
		--color-error-dark: #d4aaa3;
		--color-error: light-dark(var(--color-error-light), var(--color-error-dark));
		--crystal-code-panel: light-dark(#fbfbfa, #141519);
		--crystal-code-input: light-dark(#f0f0ee, #1c1e24);
		--crystal-code-well: light-dark(#f5f5f3, #17191e);
		--crystal-code-border: light-dark(#22252b09, #ffffff0a);
		--crystal-code-bright: light-dark(#17191c, #f5f5f7);
		--crystal-code-soft: light-dark(#e7e9ec, #20283a);
		--crystal-code-on-primary: light-dark(#fff, #0c1426);
		--crystal-code-overlay: light-dark(rgb(251 251 250 / 76%), rgb(23 25 31 / 78%));
		--crystal-code-overlay-muted: light-dark(#565a60, #b9bcc4);
		--crystal-code-veil: light-dark(rgb(240 240 238 / 4%), rgb(0 0 0 / 6%));
		--crystal-code-pane-shadow:
			0 7px 28px light-dark(#25252508, #00000020), 0 1px 4px light-dark(#25252505, #00000014);
		--crystal-code-widget-shadow: 0 3px 12px light-dark(#25252506, #00000012);
		--crystal-code-radius: 8px;
		--crystal-code-font-mono: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Courier New', monospace;
		--bref-overlay-duration: 100;
		--bref-appearance-duration: 100;
		--bref-appearance-lift: 3;
		--bref-overlay-lift: 4;
		--bref-overlay-scale: 0.99;
		--font-text: 'Inter Variable', sans-serif;
		font:
			400 13px / 1.5 -apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		display: block;
		min-width: 0;
		min-height: 100%;
		background: var(--color-background);
		color: var(--color-foreground);
		font-synthesis: none;
	}

	:global(:where(:root:has(meta[name='color-scheme'][content='light']))) [data-bref-theme] {
		color-scheme: light;
	}
	:global(:where(:root:has(meta[name='color-scheme'][content='dark']))) [data-bref-theme] {
		color-scheme: dark;
	}

	@scope ([data-theme='light']) {
		[data-bref-theme] {
			color-scheme: light;
		}
	}
	@scope ([data-theme='dark']) {
		[data-bref-theme] {
			color-scheme: dark;
		}
	}
</style>
