<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children
	}: {
		title: string;
		description: string;
		children: Snippet;
	} = $props();
</script>

<svelte:head>
	<title>{title} · Bref documentation</title>
	<meta name="description" content={description} />
</svelte:head>

<article>
	<header>
		<h1>{title}</h1>
		<p>{description}</p>
	</header>
	{@render children()}
</article>

<style>
	article {
		display: grid;
		gap: 2rem;
		max-width: 75ch;
		overflow-wrap: break-word;
	}
</style>
