<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Icon, Tabs } from 'bref-ui';
	const demos = [
		{ label: 'Todo', icon: 'checklist', id: '/(skins)/skins/(sites)/(todo)/todo' },
		{
			label: 'House Shop',
			icon: 'storefront',
			id: '/(skins)/skins/(sites)/(house-shop)/house-shop'
		},
		{ label: 'RunnerAI', icon: 'smart_toy', id: '/(skins)/skins/(sites)/(runner-ai)/runner-ai' }
	] as const;
</script>

<div data-demo-navigation-shell>
	<nav data-demo-navigation aria-label="Bref live demos">
		<a
			href={resolve('/(skins)/skins')}
			aria-label="Back to showcase"
			aria-current={page.route.id === '/(skins)/skins' ? 'page' : undefined}
		>
			<Icon name="arrow_back" />
			<span>Showcase</span>
		</a>
		<Tabs
			items={demos}
			value={demos.find((demo) => demo.id === page.route.id)?.id}
			onChange={(id) => {
				const demo = demos.find((demo) => demo.id === id);
				if (demo) void goto(resolve(demo.id), { reset: false });
			}}
			size="small"
			label="Demo sites"
		/>
	</nav>
</div>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		width: min(1128px, calc(100% - 48px));
		min-height: 44px;
		margin-inline: auto;
		padding-block: 6px;
		color: var(--color-foreground);
		border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 10%, transparent);
		font:
			500 12px / 1.5 'Inter Variable',
			sans-serif;
	}
	a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--color-muted);
		text-decoration: none;
		padding-block: 8px;
		flex-shrink: 0;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	@media (max-width: 600px) {
		nav > a span {
			display: none;
		}
	}
</style>
