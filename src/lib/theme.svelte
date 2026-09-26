<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ThemeMode } from './types.js';
	import iconFontUrl from '@fontsource-variable/material-symbols-outlined/files/material-symbols-outlined-latin-fill-normal.woff2?url';

	let { children, mode = $bindable('auto') }: { children?: Snippet; mode?: ThemeMode } = $props();
</script>

<svelte:head>
	<meta name="color-scheme" content={mode === 'auto' ? 'light dark' : mode} />
	<link rel="preload" href={iconFontUrl} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children?.()}

<style>
	@font-face {
		font-family: 'Material Symbols Outlined';
		font-style: normal;
		font-display: block;
		font-weight: 100 700;
		src: url('@fontsource-variable/material-symbols-outlined/files/material-symbols-outlined-latin-fill-normal.woff2')
			format('woff2-variations');
	}

	:global(:root) {
		--color-primary-light: #6f2638;
		--color-primary-dark: #dda5b5;
		--color-secondary-light: #71603e;
		--color-secondary-dark: #c2ab79;
		--color-background-light: #f7f3eb;
		--color-background-dark: #1e1b18;
		--color-foreground-light: #28231f;
		--color-foreground-dark: #f1eadc;
		--color-muted-light: #74685e;
		--color-muted-dark: #b5a89a;
		--color-info-light: #345b74;
		--color-info-dark: #98b8d0;
		--color-success-light: #496348;
		--color-success-dark: #afc5a2;
		--color-warning-light: #875b25;
		--color-warning-dark: #d6b080;
		--color-error-light: #9a3939;
		--color-error-dark: #e6a49c;
	}

	:global(body) {
		background: var(--color-background);
		color: var(--color-foreground);
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(:root),
	:global(:root:has(meta[name='color-scheme'][content='light'])),
	:global([data-theme='light']),
	:global([data-theme='auto']) {
		color-scheme: light;
		--color-primary: var(--color-primary-light);
		--color-secondary: var(--color-secondary-light);
		--color-background: var(--color-background-light);
		--color-foreground: var(--color-foreground-light);
		--color-muted: var(--color-muted-light);
		--color-info: var(--color-info-light);
		--color-success: var(--color-success-light);
		--color-warning: var(--color-warning-light);
		--color-error: var(--color-error-light);
	}

	:global([data-theme='dark']),
	:global(:root:has(meta[name='color-scheme'][content='dark'])) {
		color-scheme: dark;
		--color-primary: var(--color-primary-dark);
		--color-secondary: var(--color-secondary-dark);
		--color-background: var(--color-background-dark);
		--color-foreground: var(--color-foreground-dark);
		--color-muted: var(--color-muted-dark);
		--color-info: var(--color-info-dark);
		--color-success: var(--color-success-dark);
		--color-warning: var(--color-warning-dark);
		--color-error: var(--color-error-dark);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme]):not(:has(meta[name='color-scheme'][content='light']))),
		:global([data-theme='auto']) {
			color-scheme: dark;
			--color-primary: var(--color-primary-dark);
			--color-secondary: var(--color-secondary-dark);
			--color-background: var(--color-background-dark);
			--color-foreground: var(--color-foreground-dark);
			--color-muted: var(--color-muted-dark);
			--color-info: var(--color-info-dark);
			--color-success: var(--color-success-dark);
			--color-warning: var(--color-warning-dark);
			--color-error: var(--color-error-dark);
		}
	}
</style>
