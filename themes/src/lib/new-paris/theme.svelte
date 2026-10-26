<script lang="ts">
	import type { Snippet } from 'svelte';
	import './theme/fonts.css';
	import '@fontsource-variable/inter/index.css';
	let { children }: { children?: Snippet } = $props();
</script>

<div data-bref-theme="new-paris">{@render children?.()}</div>

<style>
	[data-bref-theme] {
		color-scheme: light;
		--color-primary-light: #171715;
		--color-primary-dark: #171715;
		--color-primary: light-dark(var(--color-primary-light), var(--color-primary-dark));
		--color-secondary-light: #82735e;
		--color-secondary-dark: #82735e;
		--color-secondary: light-dark(var(--color-secondary-light), var(--color-secondary-dark));
		--color-background-light: #faf9f6;
		--color-background-dark: #faf9f6;
		--color-background: light-dark(var(--color-background-light), var(--color-background-dark));
		--color-foreground-light: #171715;
		--color-foreground-dark: #171715;
		--color-foreground: light-dark(var(--color-foreground-light), var(--color-foreground-dark));
		--color-muted-light: #73716c;
		--color-muted-dark: #73716c;
		--color-muted: light-dark(var(--color-muted-light), var(--color-muted-dark));
		--color-info-light: #465367;
		--color-info-dark: #465367;
		--color-info: light-dark(var(--color-info-light), var(--color-info-dark));
		--color-success-light: #526149;
		--color-success-dark: #526149;
		--color-success: light-dark(var(--color-success-light), var(--color-success-dark));
		--color-warning-light: #7c642b;
		--color-warning-dark: #7c642b;
		--color-warning: light-dark(var(--color-warning-light), var(--color-warning-dark));
		--color-error-light: #8c3f35;
		--color-error-dark: #8c3f35;
		--color-error: light-dark(var(--color-error-light), var(--color-error-dark));
		--font-display: 'Didot', 'Bodoni MT', 'Times New Roman', serif;
		--font-accent: var(--font-display);
		--np-label-size: 0.75rem;
		--np-label-tracking: 0.14em;
		--np-caption-size: 0.875rem;
		--np-rule: #d9d5cc;
		--np-paper: #ffffff;
		--font-text: 'Inter Variable', sans-serif;
		font:
			400 14px / 1.6 'Inter Variable',
			sans-serif;
		display: block;
		min-width: 0;
		min-height: 100%;
		background: var(--color-background);
		color: var(--color-foreground);
		font-synthesis: none;
	}
	[data-bref-theme] :global(:is(h1, h2, h3)) {
		font-family: var(--font-display);
		font-weight: 400;
		letter-spacing: -0.035em;
	}
	[data-bref-theme] :global(:is(em, [data-accent])) {
		font-family: var(--font-accent);
		font-weight: 400;
	}
	[data-bref-theme] :global([data-eyebrow]) {
		font-size: var(--np-label-size);
		font-weight: 500;
		letter-spacing: var(--np-label-tracking);
		text-transform: uppercase;
	}
	[data-bref-theme] :global([data-caption]) {
		font-size: var(--np-caption-size);
		color: var(--color-muted);
		line-height: 1.5;
	}
</style>
