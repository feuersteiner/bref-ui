<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Icon, surface } from 'bref-ui';

	let { count, onCart }: { count: number; onCart: () => void } = $props();
	let header: HTMLElement;

	onMount(() => {
		const store = header.closest<HTMLElement>('[data-forma]');
		const shell = header.closest('[data-demo-root]')?.querySelector('[data-bref-header]');
		if (!store) return;

		// The shared shell wraps at smaller widths; keep both sticky bars and anchors clear.
		const measure = () => {
			store.style.setProperty(
				'--forma-shell-height',
				`${shell?.getBoundingClientRect().height ?? 0}px`
			);
			store.style.setProperty('--forma-nav-height', `${header.getBoundingClientRect().height}px`);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(header);
		if (shell) observer.observe(shell);
		return () => {
			observer.disconnect();
			store.style.removeProperty('--forma-shell-height');
			store.style.removeProperty('--forma-nav-height');
		};
	});
</script>

<header
	data-store-header
	class={surface({ color: 'background', variant: 'filled', glass: true, shadow: 'small' })}
	bind:this={header}
>
	<div>
		<a data-wordmark href="#demo-content" aria-label="House Shop home">
			<Icon name="storefront" />House Shop
		</a>
		<nav aria-label="Store"><a href="#collection">Collection</a></nav>
		<Button
			label={`Cart (${count})`}
			icon={{ name: 'shopping_cart' }}
			variant="filled"
			onClick={onCart}
		/>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: var(--forma-shell-height, 0px);
		z-index: 5;
		border: 0;
		border-bottom: 1px solid var(--forma-rule);
	}
	header > div {
		max-width: 1280px;
		min-height: 88px;
		margin-inline: auto;
		padding: 16px 48px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	[data-wordmark] {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font:
			550 30px/1 'Bricolage Grotesque Variable',
			sans-serif;
		letter-spacing: -0.055em;
		white-space: nowrap;
	}
	nav a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-size: 13px;
		text-underline-offset: 5px;
	}
	nav a:hover {
		text-decoration: underline;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
		border-radius: 2px;
	}
	@media (max-width: 900px) {
		header > div {
			padding-inline: 28px;
		}
	}
	@media (max-width: 600px) {
		header > div {
			min-height: 76px;
			padding: 12px 24px;
			gap: 12px;
		}
		[data-wordmark] {
			font-size: 24px;
		}
	}
	@media (max-width: 440px) {
		header > div {
			display: grid;
			grid-template-columns: 1fr auto;
			gap: 0 12px;
		}
		nav {
			grid-column: 1;
			grid-row: 2;
		}
	}
	@media (max-width: 380px) {
		header > div {
			padding-inline: 16px;
			gap: 8px;
		}
		[data-wordmark] {
			font-size: 21px;
		}
		nav a {
			font-size: 12px;
		}
	}
	a {
		color: inherit;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
</style>
