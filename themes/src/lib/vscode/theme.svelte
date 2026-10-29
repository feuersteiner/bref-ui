<script lang="ts">
	import type { Snippet } from 'svelte';
	import './theme/fonts.css';

	let { children }: { children?: Snippet } = $props();
</script>

<div data-bref-theme="vscode">{@render children?.()}</div>

<style>
	[data-bref-theme] {
		color-scheme: dark;
		--color-primary-light: #3794ff;
		--color-primary-dark: #3794ff;
		--color-primary: light-dark(var(--color-primary-light), var(--color-primary-dark));
		--color-secondary-light: #c586c0;
		--color-secondary-dark: #c586c0;
		--color-secondary: light-dark(var(--color-secondary-light), var(--color-secondary-dark));
		--color-background-light: #1e1e1e;
		--color-background-dark: #1e1e1e;
		--color-background: light-dark(var(--color-background-light), var(--color-background-dark));
		--color-foreground-light: #cccccc;
		--color-foreground-dark: #cccccc;
		--color-foreground: light-dark(var(--color-foreground-light), var(--color-foreground-dark));
		--color-muted-light: #a0a0a0;
		--color-muted-dark: #a0a0a0;
		--color-muted: light-dark(var(--color-muted-light), var(--color-muted-dark));
		--color-info-light: #9cdcfe;
		--color-info-dark: #9cdcfe;
		--color-info: light-dark(var(--color-info-light), var(--color-info-dark));
		--color-success-light: #89d185;
		--color-success-dark: #89d185;
		--color-success: light-dark(var(--color-success-light), var(--color-success-dark));
		--color-warning-light: #cca700;
		--color-warning-dark: #cca700;
		--color-warning: light-dark(var(--color-warning-light), var(--color-warning-dark));
		--color-error-light: #f48771;
		--color-error-dark: #f48771;
		--color-error: light-dark(var(--color-error-light), var(--color-error-dark));
		--vscode-panel: #252526;
		--vscode-input: #3c3c3c;
		--vscode-border: #454545;
		--vscode-accent: #0078d4;
		--vscode-font-mono: Menlo, Monaco, Consolas, 'Droid Sans Mono', 'Courier New', monospace;
		--font-text: 'Inter Variable', sans-serif;
		font:
			400 13px / 1.5 'Segoe UI',
			system-ui,
			sans-serif;
		display: block;
		min-width: 0;
		min-height: 100%;
		background: var(--color-background);
		color: var(--color-foreground);
		font-synthesis: none;
	}
</style>
