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
		gap: 72px;
		min-width: 0;
		overflow-wrap: break-word;
	}

	header {
		position: relative;
		display: grid;
		gap: 24px;
		padding: 24px 24px 48px;
	}
	header::before {
		position: absolute;
		inset: 0 0 auto;
		border-top: 1px solid var(--docs-rule-strong);
		content: '';
		pointer-events: none;
	}
	h1 {
		max-width: 12ch;
		letter-spacing: -0.045em;
	}
	header p {
		max-width: 60ch;
		color: var(--color-muted);
		font-size: 1.25rem;
		line-height: 1.5;
	}
	@media (max-width: 575px) {
		article {
			gap: 48px;
		}
		header {
			padding: 24px 0;
		}
		header p {
			font-size: 1.125rem;
		}
	}
</style>
