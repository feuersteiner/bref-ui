<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { Button } from 'bref-ui';
	import type { IconName, ThemeMode } from 'bref-ui/types';
	import type { Snippet } from 'svelte';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/syne';
	import GithubStars from './github-stars.svelte';

	let {
		mode = $bindable<ThemeMode>('light'),
		contentId = 'showcase-content',
		children
	}: { mode?: ThemeMode; contentId?: string; children?: Snippet } = $props();
	const modes: ThemeMode[] = ['auto', 'light', 'dark'];
	const labels: Record<ThemeMode, string> = { auto: 'System', light: 'Light', dark: 'Dark' };
	const icons: Record<ThemeMode, IconName> = {
		auto: 'brightness_auto',
		light: 'light_mode',
		dark: 'dark_mode'
	};
</script>

<header data-bref-header data-mode={mode}>
	<a data-skip href={`#${contentId}`}>Skip to content</a>
	<div>
		<div data-brand>
			<a data-logo href={resolve('/(docs)')} aria-label="Bref documentation home">
				<img src={asset('favicon.svg')} alt="" width="40" height="40" />
				<strong>bref<span data-slash>/</span>themes</strong>
			</a>
			<a data-attribution href={resolve('/(docs)')}>
				Part of <strong>bref<span data-slash>/</span>ui</strong>
			</a>
		</div>
		<p>Svelte themes & demos.</p>
		<nav aria-label="Showcase">
			<a href={resolve('/(skins)/skins#demos')}>Demos</a>
			<a href={resolve('/(docs)/themes')}>Themes</a>
		</nav>
		<span data-header-actions>
			<GithubStars {mode} />
			<Button
				variant="neutral"
				rounded
				size="small"
				icon={{ name: icons[mode], label: labels[mode] }}
				onClick={() => (mode = modes[(modes.indexOf(mode) + 1) % modes.length])}
			/>
		</span>
	</div>
	{@render children?.()}
</header>

<style>
	header {
		/* Plain shell content keeps its identity; library controls use the active palette. */

		position: sticky;
		top: 0;
		z-index: 10;
		background: light-dark(#f1eee7, #18191c);
		box-shadow:
			0 1px 3px light-dark(rgb(0 0 0 / 6%), rgb(0 0 0 / 20%)),
			0 4px 14px light-dark(rgb(0 0 0 / 4%), rgb(0 0 0 / 14%));
		color: light-dark(#151515, #eceef2);
		color-scheme: light;
		font:
			400 16px / 24px 'Inter Variable',
			sans-serif;
	}
	header[data-mode='dark'] {
		color-scheme: dark;
	}
	header[data-mode='auto'] {
		color-scheme: light dark;
	}
	header > div {
		background: light-dark(#f1eee7, #18191c);
		width: min(1128px, calc(100% - 48px));
		min-height: 72px;
		margin-inline: auto;
		display: grid;
		grid-template-columns: 240px 1fr auto auto;
		gap: 24px;
		align-items: center;
		border-bottom: 1px solid color-mix(in srgb, light-dark(#151515, #eceef2) 10%, transparent);
	}
	[data-logo],
	[data-header-actions],
	nav {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	[data-header-actions] {
		gap: 8px;
	}
	[data-brand] {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	[data-attribution] {
		align-self: flex-start;
		margin-inline-start: 52px;
		display: flex;
		align-items: baseline;
		gap: 4px;
		color: light-dark(#696661, #acb0b8);
		font-size: 11px;
		line-height: 16px;
	}
	[data-attribution] strong {
		color: light-dark(#151515, #eceef2);
		font-size: 14px;
	}
	[data-attribution]:hover {
		text-decoration: underline;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	a:focus-visible {
		outline: 2px solid light-dark(#1d4ed8, #92b4df);
		outline-offset: 4px;
	}
	[data-skip] {
		position: fixed;
		top: 8px;
		left: 8px;
		z-index: 1;
		padding: 12px;
		background: light-dark(#f1eee7, #18191c);
		transform: translateY(-160%);
	}
	[data-skip]:focus {
		transform: none;
	}
	strong {
		font:
			700 24px / 1.2 'Syne Variable',
			sans-serif;
		white-space: nowrap;
	}
	strong [data-slash] {
		color: light-dark(#1d4ed8, #92b4df);
	}
	p {
		color: light-dark(#696661, #acb0b8);
	}
	nav {
		gap: 4px;
		font-size: 13px;
	}
	nav a {
		padding: 10px 8px;
		border-radius: 8px;
	}
	nav a:hover {
		background: color-mix(in srgb, light-dark(#151515, #eceef2) 5%, transparent);
	}
	@media (max-width: 1000px) {
		header > div {
			grid-template-columns: 1fr auto auto;
			gap: 12px;
		}
		p {
			display: none;
		}
	}
	@media (max-width: 600px) {
		header > div {
			grid-template-columns: 1fr auto;
			gap: 0 8px;
		}
		nav {
			grid-column: 1 / -1;
			grid-row: 2;
			padding-bottom: 8px;
		}
		[data-brand],
		[data-header-actions] {
			min-height: 64px;
		}
	}
	@media (max-width: 400px) {
		[data-logo] img {
			display: none;
		}
		[data-attribution] {
			margin-inline-start: 0;
		}
	}
	@media (max-width: 360px) {
		[data-logo] strong {
			font-size: 20px;
		}
	}
</style>
