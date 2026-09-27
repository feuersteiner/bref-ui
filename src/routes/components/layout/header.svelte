<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { Button, Icon, ThemeModeToggle } from '$lib/index.js';
	import type { IconName, ThemeMode } from '$lib/types.js';
	import { getContext } from 'svelte';
	import GithubStars from './github-stars.svelte';

	let { navOpen = $bindable(false) }: { navOpen?: boolean } = $props();
	let menuButton: HTMLButtonElement;
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

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape' && navOpen) {
			navOpen = false;
			menuButton.focus();
		}
	}}
/>
<header>
	<div>
		<a href={resolve('/')} aria-label="Bref documentation home" data-logo
			><img src={asset('/favicon.svg')} alt="" width="40" height="40" /><strong
				>bref<span data-slash>/</span>ui</strong
			></a
		>
		<p>Svelte components, simply.</p>
		<ThemeModeToggle mode={theme.mode} />
		<span data-actions>
			<Button
				variant="neutral"
				rounded
				size="small"
				icon={{ name: icons[theme.mode], label: labels[theme.mode] }}
				onClick={cycleTheme}
			/>
			<GithubStars />
		</span>
		<button
			bind:this={menuButton}
			type="button"
			aria-label="Documentation navigation"
			aria-controls="documentation-navigation"
			aria-expanded={navOpen}
			onclick={() => (navOpen = !navOpen)}
		>
			<Icon name={navOpen ? 'close' : 'menu'} size="medium" />
		</button>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 2;
		height: 72px;
		border-bottom: 1px solid var(--docs-rule-strong);
		background: var(--color-background);
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
		font-weight: 700;
		font-size: 1.5rem;
	}
	strong [data-slash] {
		color: var(--color-primary);
	}
	header p {
		color: var(--color-muted);
	}
	button {
		display: none;
		width: 48px;
		height: 48px;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--docs-rule);
		border-radius: 8px;
		background: transparent;
		color: var(--color-foreground);
		cursor: pointer;
	}
	@supports (width: round(down, 100px, 24px)) {
		header > div {
			width: min(1128px, round(down, calc(100vw - 48px), 24px));
		}
	}
	@media (max-width: 815px) {
		header > div {
			grid-template-columns: 1fr auto 48px;
		}
		header p {
			display: none;
		}
		button {
			display: inline-flex;
		}
	}
</style>
