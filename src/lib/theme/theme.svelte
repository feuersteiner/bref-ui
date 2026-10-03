<script lang="ts">
	import type { ThemeProps } from './types.js';

	let { children, palette = {} }: ThemeProps = $props();
	const roles = [
		'primary',
		'secondary',
		'background',
		'foreground',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	] as const;
	let paletteCss = $derived.by(() => {
		const modes = 'light' in palette ? palette : { light: palette, dark: palette };
		const declarations = (['light', 'dark'] as const).flatMap((mode) =>
			roles.flatMap((role) => {
				const value = modes[mode][role];
				if (value === undefined) return [];
				if (!/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value))
					throw new Error(`Theme palette ${mode}.${role} must be a hex color.`);
				return `--user-input-${role}-${mode}: ${value};`;
			})
		);
		return `:root { ${declarations.join(' ')} }`;
	});
</script>

<svelte:head>
	<svelte:element this={"style"}>{paletteCss}</svelte:element>
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
		--color-primary-light: var(--user-input-primary-light, #1d4ed8);
		--color-primary-dark: var(--user-input-primary-dark, #92b4df);
		--color-secondary-light: var(--user-input-secondary-light, #c51630);
		--color-secondary-dark: var(--user-input-secondary-dark, #df97a5);
		--color-background-light: var(--user-input-background-light, #f1eee7);
		--color-background-dark: var(--user-input-background-dark, #18191c);
		--color-foreground-light: var(--user-input-foreground-light, #151515);
		--color-foreground-dark: var(--user-input-foreground-dark, #eceef2);
		--color-muted-light: var(--user-input-muted-light, #696661);
		--color-muted-dark: var(--user-input-muted-dark, #acb0b8);
		--color-info-light: var(--user-input-info-light, #2563b8);
		--color-info-dark: var(--user-input-info-dark, #a3c1d1);
		--color-success-light: var(--user-input-success-light, #34745a);
		--color-success-dark: var(--user-input-success-dark, #abc3a3);
		--color-warning-light: var(--user-input-warning-light, #945c08);
		--color-warning-dark: var(--user-input-warning-dark, #d9bc82);
		--color-error-light: var(--user-input-error-light, #bc2436);
		--color-error-dark: var(--user-input-error-dark, #dfa4a7);
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
