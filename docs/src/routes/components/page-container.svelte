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
		grid-template-columns: minmax(0, 1fr);
		gap: 48px;
		min-width: 0;
		overflow-wrap: break-word;
	}

	header {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 20px;
		padding: 24px 24px;
	}
	h1 {
		max-width: 12ch;
		letter-spacing: -0.045em;
	}
	header p {
		max-width: 60ch;
		color: var(--color-muted);
		font-size: 1.125rem;
		line-height: 1.5;
	}
	@media (max-width: 575px) {
		article {
			gap: 32px;
		}
		header {
			padding: 24px 0;
		}
		header p {
			font-size: 1.125rem;
		}
	}
</style>
