<script lang="ts">
	import type { Snippet } from 'svelte';
	import iconFontUrl from '@fontsource-variable/material-symbols-outlined/files/material-symbols-outlined-latin-fill-normal.woff2?url';

	let { children }: { children?: Snippet } = $props();
</script>

<svelte:head>
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
		--color-primary-light: #243f64;
		--color-primary-dark: #92b4df;
		--color-secondary-light: #8b3042;
		--color-secondary-dark: #df97a5;
		--color-background-light: #f6f4ec;
		--color-background-dark: #18191c;
		--color-foreground-light: #302e2a;
		--color-foreground-dark: #eceef2;
		--color-muted-light: #706b62;
		--color-muted-dark: #acb0b8;
		--color-info-light: #45677b;
		--color-info-dark: #a3c1d1;
		--color-success-light: #4e6c4b;
		--color-success-dark: #abc3a3;
		--color-warning-light: #815f28;
		--color-warning-dark: #d9bc82;
		--color-error-light: #a04448;
		--color-error-dark: #dfa4a7;
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
