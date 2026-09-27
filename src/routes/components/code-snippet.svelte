<script module lang="ts">
	import { createHighlighterCoreSync } from 'shiki/core';
	import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
	import svelte from 'shiki/langs/svelte.mjs';
	import githubLight from 'shiki/themes/github-light.mjs';
	import githubDark from 'shiki/themes/github-dark.mjs';
	import { format } from 'prettier/standalone';
	import * as sveltePlugin from 'prettier-plugin-svelte/browser';
	import * as babelPlugin from 'prettier/plugins/babel';
	import * as estreePlugin from 'prettier/plugins/estree';
	import * as typescriptPlugin from 'prettier/plugins/typescript';
	import * as postcssPlugin from 'prettier/plugins/postcss';

	// The standalone build never reads prettier.config.js, so register the plugins
	// (with the embedded script/style parsers) and mirror the project options.
	const formatOptions = {
		parser: 'svelte',
		plugins: [sveltePlugin, estreePlugin, babelPlugin, typescriptPlugin, postcssPlugin],
		useTabs: true,
		singleQuote: true,
		trailingComma: 'none',
		printWidth: 100
	} satisfies Parameters<typeof format>[1];

	// Shared by every snippet; synchronous tokens also render during prerendering.
	const highlighter = createHighlighterCoreSync({
		langs: [svelte],
		themes: [githubLight, githubDark],
		engine: createJavaScriptRegexEngine()
	});
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button } from '$lib/index.js';

	let { source, label = 'Code snippet' }: { source: string; label?: string } = $props();
	const newline = '\n';
	// svelte-ignore state_referenced_locally

	let feedback = $state('');
	const copied = $derived(feedback === 'Copied to clipboard.');
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => clearTimeout(resetTimer));
	const copy = async () => {
		clearTimeout(resetTimer);
		try {
			await navigator.clipboard.writeText(source);
			feedback = 'Copied to clipboard.';
		} catch {
			feedback = 'Copy failed. Select and copy the code manually.';
		}
		resetTimer = setTimeout(() => (feedback = ''), 3000);
	};
</script>

<div
	data-code-snippet
	style:--snippet-light-background={highlighter.getTheme('github-light').bg}
	style:--snippet-dark-background={highlighter.getTheme('github-dark').bg}
>
	<header>
		<span>Svelte</span>
		<Button
			icon={{ name: copied ? 'check' : 'content_copy', label: copied ? 'Copied' : 'Copy code' }}
			size="x-small"
			color={copied ? 'success' : 'foreground'}
			variant="neutral"
			rounded
			disabled={copied}
			onClick={copy}
		/>
	</header>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (Allow keyboard scrolling of wide code blocks.) -->
	<svelte:boundary>
		{@const formattedSource = await format(source, formatOptions)}
		{@const highlighted = highlighter.codeToTokensWithThemes(formattedSource, {
			lang: 'svelte',
			themes: { light: 'github-light', dark: 'github-dark' }
		})}
		<pre role="region" aria-label={label} tabindex="0"><code
				>{#each highlighted as line, index (index)}{#if index > 0}{newline}{/if}{#each line as token (token.offset)}<span
							style:--token-light={token.variants.light.color}
							style:--token-dark={token.variants.dark.color}>{token.content}</span
						>{/each}{/each}</code
			></pre>
	</svelte:boundary>
	<p role="status">{feedback}</p>
</div>

<style>
	div {
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--docs-rule);
		border-radius: 12px;
		background: light-dark(var(--snippet-light-background), var(--snippet-dark-background));
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 48px;
		padding: 4px 8px 4px 20px;
		border-bottom: 1px solid var(--docs-rule-subtle);
		background: var(--docs-surface);
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.04em;
	}
	pre {
		margin: 0;
		padding: 20px;
		overflow-x: auto;
		tab-size: 2;
		font-size: 13px;
		line-height: 1.75;
		white-space: pre;
		overscroll-behavior-x: contain;
	}
	pre:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -3px;
	}
	code {
		font: inherit;
	}
	code span {
		color: light-dark(var(--token-light), var(--token-dark));
	}
	p {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	@media (max-width: 575px) {
		header {
			padding-left: 16px;
		}
		pre {
			padding: 16px;
		}
	}
	@media (forced-colors: active) {
		code span {
			color: CanvasText;
		}
	}
</style>
