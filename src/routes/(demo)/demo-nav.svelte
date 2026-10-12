<script lang="ts">
	import { Icon } from '$lib/index.js';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	const demos = [{ name: 'Relay', href: '/relay' }] as const;
</script>

<a data-skip href="#demo-content">Skip to content</a>
<nav aria-label="Bref live demos">
	<a href={resolve('/')} aria-label="Back to documentation">
		<Icon name="arrow_back" />
		<span>Docs</span>
	</a>
	<div>
		{#each demos as demo (demo.href)}
			<a
				href={resolve(demo.href)}
				aria-current={page.url.pathname.endsWith(demo.href) ? 'page' : undefined}
			>
				{demo.name}
			</a>
		{/each}
	</div>
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 12px 4%;
		border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 12%, transparent);
		font:
			500 12px / 1.5 'Inter Variable',
			sans-serif;
	}
	nav > a,
	nav div {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	a {
		color: var(--color-muted);
		text-decoration: none;
	}
	a[aria-current] {
		color: var(--color-foreground);
	}
	a[aria-current] {
		text-decoration: underline;
		text-underline-offset: 5px;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	[data-skip] {
		position: fixed;
		top: 8px;
		left: 8px;
		z-index: 10;
		padding: 12px;
		background: var(--color-background);
		transform: translateY(-150%);
	}
	[data-skip]:focus {
		transform: none;
	}
	@media (max-width: 600px) {
		nav > a span {
			display: none;
		}
		nav div {
			gap: 14px;
		}
	}
</style>
