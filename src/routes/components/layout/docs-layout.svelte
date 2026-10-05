<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { Dialog } from '$lib/index.js';
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import SiteHeader from './header.svelte';
	import Sidebar from './sidebar.svelte';

	let { children }: { children: Snippet } = $props();
	let navOpen = $state(false);
	const smallScreen = new MediaQuery('(max-width: 815px)', false);
	$effect(() => {
		if (!smallScreen.current) navOpen = false;
	});
	afterNavigate(() => {
		navOpen = false;
	});
</script>

<a href="#content">Skip to content</a>
<SiteHeader bind:navOpen smallScreen={smallScreen.current} />
<Dialog
	id="documentation-navigation"
	bind:open={navOpen}
	header={{ title: 'Documentation navigation' }}
	size="full-screen"
	onclick={(event) => {
		if (event.target instanceof Element && event.target.closest('a')) navOpen = false;
	}}
>
	<Sidebar />
</Dialog>
<div data-layout>
	{#if !smallScreen.current}<aside><Sidebar /></aside>{/if}
	<main id="content" tabindex="-1">{@render children()}</main>
</div>

<style>
	a[href='#content'] {
		position: fixed;
		inset: 24px auto auto 24px;
		z-index: 3;
		padding: 24px;
		background: var(--color-background);
		transform: translateY(-192px);
	}
	a[href='#content']:focus {
		transform: none;
	}
	[data-layout] {
		--article-width: min(864px, calc(100vw - 312px));
		--layout-edge: calc((100vw - 264px - var(--article-width)) / 2);
		display: grid;
		grid-template-columns: 240px var(--article-width);
		gap: 24px;
		align-items: start;
		width: max-content;
		margin-inline: auto;
		padding-block: 48px;
	}
	aside {
		position: sticky;
		top: 72px;
		height: calc(100dvh - 72px);
		margin-block: -48px;
		padding-block: 48px;
		overflow-y: auto;
		border-right: 1px solid var(--docs-rule);
	}
	main {
		min-width: 0;
		grid-column: 2;
		grid-row: 1;
	}
	@supports (width: round(down, 100px, 24px)) {
		[data-layout] {
			--article-width: min(864px, round(down, calc(100vw - 312px), 24px));
		}
	}
	@media (max-width: 815px) {
		[data-layout] {
			--article-width: calc(100vw - 48px);
			--layout-edge: 24px;
			grid-template-columns: var(--article-width);
			padding-block: 24px;
		}
		aside {
			display: none;
		}
		main {
			grid-column: 1;
			grid-row: auto;
		}
	}
	@supports (width: round(down, 100px, 24px)) {
		@media (max-width: 815px) {
			[data-layout] {
				--article-width: round(down, calc(100vw - 48px), 24px);
			}
		}
	}
</style>
