<script lang="ts">
	const user = 'feuersteiner';
	const repo = 'bref-ui';
</script>

<span>
	<a
		href="https://github.com/{user}/{repo}"
		target="_blank"
		rel="noopener"
		aria-label="Star {repo} on GitHub"
	>
		<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
			<path
				d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
			/>
		</svg>
		Star
	</a>
	<svelte:boundary>
		{@const response = await fetch(`https://api.github.com/repos/${user}/${repo}`)}
		{@const data = response.ok ? await response.json() : null}
		{#if typeof data?.stargazers_count === 'number'}
			{@const count = String(data.stargazers_count)}
			<a
				href="https://github.com/{user}/{repo}/stargazers"
				target="_blank"
				rel="noopener"
				aria-label="{count} stargazers on GitHub">{count}</a
			>
		{/if}
		{#snippet pending()}{/snippet}
		{#snippet failed()}{/snippet}
	</svelte:boundary>
</span>

<style>
	span {
		--internal-border: #d5d5d5;
		--internal-background: #fafafa;
		--internal-foreground: #333;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font:
			700 13px / 1 Arial,
			sans-serif;
		white-space: nowrap;
	}
	a {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 3px;
		height: 24px;
		padding: 0 6px;
		border: 1px solid var(--internal-border);
		border-radius: 4px;
		background: var(--internal-background);
		color: var(--internal-foreground);
		text-decoration: none;
	}
	a:first-child {
		background: linear-gradient(var(--internal-background), #ededed);
	}
	a[href$='/stargazers']::before {
		position: absolute;
		top: 50%;
		left: -4px;
		width: 6px;
		height: 6px;
		border: solid var(--internal-border);
		border-width: 0 0 1px 1px;
		background: inherit;
		content: '';
		transform: translateY(-50%) rotate(45deg);
	}
	a:hover {
		--internal-background: #f0f0f0;
		--internal-border: #bcbcbc;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
	svg {
		flex-shrink: 0;
	}
</style>
