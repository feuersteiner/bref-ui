<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { Button, ThemeModeToggle } from '$lib/index.js';
	import type { IconName, ThemeMode } from '$lib/types.js';
	import { getContext } from 'svelte';
	import GithubStars from './github-stars.svelte';

	let {
		navOpen = $bindable(false),
		smallScreen = false
	}: { navOpen?: boolean; smallScreen?: boolean } = $props();
	const theme = getContext<{ mode: ThemeMode }>('documentation-theme');
	const modes: ThemeMode[] = ['auto', 'light', 'dark'];
	const labels: Record<ThemeMode, string> = {
		auto: 'System',
		light: 'Light',
		dark: 'Dark'
	};
	const icons: Record<ThemeMode, IconName> = {
		auto: 'brightness_auto',
		light: 'light_mode',
		dark: 'dark_mode'
	};
	const cycleTheme = () => {
		const currentIndex = modes.indexOf(theme.mode);
		theme.mode = modes[(currentIndex + 1) % modes.length];
	};
</script>

<header>
	<div>
		{#if smallScreen}
			<Button
				size="small"
				icon={{ name: 'menu', label: 'Documentation navigation' }}
				aria-controls="documentation-navigation"
				aria-expanded={navOpen}
				aria-haspopup="dialog"
				onClick={() => (navOpen = true)}
			/>
		{/if}
		<a href={resolve('/')} aria-label="Bref documentation home" data-logo>
			<img src={asset('/favicon.svg')} alt="" width="40" height="40" />
			<strong>
				bref
				<span data-slash>/</span>
				ui
			</strong>
		</a>
		<p>Svelte components, simply.</p>
		<ThemeModeToggle mode={theme.mode} />
		<span data-actions>
			<GithubStars />
			<Button
				variant="neutral"
				rounded
				size="small"
				icon={{ name: icons[theme.mode], label: labels[theme.mode] }}
				onClick={cycleTheme}
			/>
		</span>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 2;
		height: 72px;
		background: color-mix(in srgb, var(--color-background) 94%, transparent);
	}
	header > div {
		width: min(1128px, calc(100vw - 48px));
		height: 72px;
		margin-inline: auto;
		display: grid;
		grid-template-columns: 240px 1fr auto;
		gap: 24px;
		align-items: center;
	}
	[data-actions] {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
	}
	header a {
		color: var(--color-foreground);
		text-decoration: none;
	}
	[data-logo] {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	strong {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: 1.5rem;
		white-space: nowrap;
	}
	strong [data-slash] {
		color: var(--color-primary);
	}
	header p {
		color: var(--color-muted);
	}
	@supports (width: round(down, 100px, 24px)) {
		header > div {
			width: min(1128px, round(down, calc(100vw - 48px), 24px));
		}
	}
	@media (max-width: 815px) {
		header > div {
			grid-template-columns: 40px minmax(0, 1fr) auto;
			gap: 12px;
		}
		header p {
			display: none;
		}
		[data-logo] {
			gap: 8px;
		}
	}
	@media (max-width: 512px) {
		[data-logo] img {
			display: none;
		}
	}
	@media (max-width: 360px) {
		header > div {
			gap: 6px;
		}
		strong {
			font-size: 1rem;
		}
	}
</style>
