<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '$lib/icon/icon.svelte';

	const user = 'feuersteiner';
	const repo = 'bref-ui';

	let count = $state<string | null>(null);

	// Public GitHub API, no token needed; limited to 60 requests/hour per
	// client IP. On failure (e.g. rate limit) the count bubble stays hidden.
	onMount(() => {
		fetch(`https://api.github.com/repos/${user}/${repo}`)
			.then((response) => response.json())
			.then((data) => {
				if (typeof data.stargazers_count === 'number')
					count = data.stargazers_count.toLocaleString('en-US');
			})
			.catch(() => {});
	});
</script>

<span>
	<a
		href="https://github.com/{user}/{repo}"
		target="_blank"
		rel="noopener"
		aria-label="Star {repo} on GitHub"
	>
		<Icon name="star" label="Star" size="medium" />
		Star
	</a>
	{#if count !== null}
		<a
			href="https://github.com/{user}/{repo}/stargazers"
			target="_blank"
			rel="noopener"
			aria-label="{count} stargazers on GitHub">{count}</a
		>
	{/if}
</span>

<style>
	span {
		display: inline-flex;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
	}
	a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border: 1px solid var(--docs-rule);
		color: var(--color-foreground);
		text-decoration: none;
	}
	a:first-child {
		border-radius: 8px;
		background: var(--docs-surface);
	}
	a:first-child:not(:last-child) {
		border-radius: 8px 0 0 8px;
	}
	a + a {
		border-left: 0;
		border-radius: 0 8px 8px 0;
		color: var(--color-muted);
	}
	a:hover {
		color: var(--color-primary);
	}
</style>
