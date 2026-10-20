<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '$lib/index.js';
	import CodeSnippet from './code-snippet.svelte';

	let {
		preview,
		children,
		status,
		source,
		onReset
	}: {
		preview: Snippet;
		children: Snippet;
		status?: Snippet;
		source: string;
		onReset: () => void;
	} = $props();
</script>

<div data-playground>
	<div data-workspace>
		<div data-preview>
			<header><h3>Live preview</h3></header>
			<div data-stage>{@render preview()}</div>
			{#if status}<footer>{@render status()}</footer>{/if}
		</div>
		<div data-settings>
			<header>
				<h3>Settings</h3>
				<Button label="Reset" size="x-small" variant="neutral" onClick={onReset} />
			</header>
			{@render children()}
		</div>
	</div>
	<details>
		<summary>View generated code</summary>
		<CodeSnippet {source} label="Playground code" />
	</details>
</div>

<style>
	[data-playground] {
		display: grid;
		gap: 24px;
		min-width: 0;
	}
	[data-workspace] {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 248px;
		gap: 32px;
		align-items: start;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 32px;
	}
	h3 {
		font: 500 13px / 20px var(--font-text);
		color: var(--color-muted);
	}
	[data-preview] {
		position: sticky;
		top: 104px;
		display: grid;
		grid-template-rows: auto minmax(280px, 1fr) auto;
		min-width: 0;
		min-height: 400px;
		padding: 24px;
		border-radius: 16px;
		background: var(--docs-surface);
	}
	[data-stage] {
		position: relative;
		isolation: isolate;
		display: grid;
		align-items: center;
		min-width: 0;
	}
	footer {
		position: relative;
		padding-top: 16px;
		color: var(--color-muted);
		font-size: 12px;
		line-height: 20px;
	}
	[data-settings] {
		display: grid;
		gap: 24px;
		min-width: 0;
	}
	details {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		min-width: 0;
	}
	summary {
		width: fit-content;
		padding-block: 8px;
		color: var(--color-muted);
		font-size: 13px;
		cursor: pointer;
	}
	summary:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
		border-radius: 4px;
	}
	details[open] summary {
		margin-bottom: 16px;
	}
	@media (max-width: 1100px) {
		[data-workspace] {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
		}
		[data-preview] {
			position: static;
			min-height: 320px;
			grid-template-rows: auto minmax(200px, 1fr) auto;
		}
	}
</style>
