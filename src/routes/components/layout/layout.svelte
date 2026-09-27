<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import Sidebar from './sidebar.svelte';
	import { pageSections } from './navigation.js';

	let { children }: { children: Snippet } = $props();
</script>

<a href="#content">Skip to content</a>
<header>
	<a href={resolve('/')} aria-label="Bref documentation home"><strong>bref</strong></a>
	<p>Svelte components, simply.</p>
</header>
<div>
	<Sidebar sections={pageSections[page.route.id ?? ''] ?? []} />
	<main id="content" tabindex="-1">{@render children()}</main>
</div>

<style>
	a[href='#content']:not(:focus) {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	div {
		display: grid;
		grid-template-columns: 15rem minmax(0, 1fr);
		align-items: start;
		gap: 2rem;
		padding-block: 1rem;
	}

	main {
		min-width: 0;
	}

	@media (max-width: 48rem) {
		div {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
