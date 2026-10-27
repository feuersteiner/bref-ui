<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button, Theme } from 'bref-ui';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/syne';

	const notFound = $derived(page.status === 404);
	const title = $derived(notFound ? 'Page not found' : 'Something went wrong');
	const message = $derived(
		page.error?.message ||
			(notFound ? 'This page could not be found.' : 'An unexpected error occurred.')
	);
</script>

<svelte:head>
	<title>{page.status} · {title} · Bref</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Theme>
	<main>
		<div>
			<p>{page.status}</p>
			<h1>{title}</h1>
			<p>{message}</p>
			<Button label="Back to docs" href={resolve('')} variant="filled" color="primary" />
		</div>
	</main>
</Theme>

<style>
	main {
		display: grid;
		place-items: center;
		min-height: 100dvh;
		padding: 24px;
		font:
			400 16px/1.5 'Inter Variable',
			sans-serif;
		text-align: center;
	}
	main > div {
		display: grid;
		justify-items: center;
		gap: 24px;
		width: min(100%, 40rem);
		overflow-wrap: anywhere;
	}
	h1 {
		font:
			700 clamp(32px, 7vw, 64px)/1.05 'Syne Variable',
			sans-serif;
		letter-spacing: -0.045em;
	}
	p {
		color: var(--color-muted);
	}
</style>
