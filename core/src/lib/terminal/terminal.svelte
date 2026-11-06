<script lang="ts">
	import type { TerminalProps } from 'bref-ui/types';

	let { lines, windowTitle = 'Terminal', ...attributes }: TerminalProps = $props();
</script>

<!-- The overflow viewport needs keyboard scrolling. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div role="region" aria-label={windowTitle || 'Terminal'} tabindex="0" {...attributes}>
	<p>
		<span aria-hidden="true">
			<i></i>
			<i></i>
			<i></i>
		</span>
		<strong>{windowTitle}</strong>
	</p>
	<pre><samp>{lines.join('\n')}</samp></pre>
</div>

<style>
	div {
		box-sizing: border-box;
		min-width: 0;
		max-block-size: 24rem;
		overflow: auto;
		border: 1px solid color-mix(in srgb, var(--color-foreground-dark, #eceef2) 18%, transparent);
		border-radius: 0.875rem;
		background: var(--color-background-dark, #18191c);
		color: var(--color-foreground-dark, #eceef2);
		color-scheme: dark;
		box-shadow: 0 1rem 2.5rem color-mix(in srgb, black 18%, transparent);
		text-align: start;
	}
	div:focus-visible {
		outline: 2px solid var(--color-primary-dark, #92b4df);
		outline-offset: 3px;
	}
	p {
		margin: 0;
		display: grid;
		grid-template-columns: 3.25rem minmax(0, 1fr) 3.25rem;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
		background: color-mix(in srgb, currentColor 5%, transparent);
	}
	span {
		display: flex;
		gap: 0.375rem;
	}
	i {
		width: 0.625rem;
		height: 0.625rem;
		flex: none;
		border-radius: 50%;
		background: var(--color-error-dark, #dfa4a7);
	}
	i:nth-child(2) {
		background: var(--color-warning-dark, #d9bc82);
	}
	i:nth-child(3) {
		background: var(--color-success-dark, #abc3a3);
	}
	strong {
		overflow: hidden;
		font:
			500 0.75rem / 1.25 system-ui,
			sans-serif;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	pre {
		min-block-size: 3rem;
		margin: 0;
		padding: 1.25rem;
		font:
			0.8125rem / 1.75 ui-monospace,
			SFMono-Regular,
			Menlo,
			Consolas,
			monospace;
		tab-size: 4;
		white-space: pre;
	}
	samp {
		font: inherit;
	}
	@media (forced-colors: active) {
		div {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
		}
		div:focus-visible {
			outline-color: Highlight;
		}
		i,
		i:nth-child(2),
		i:nth-child(3) {
			background: CanvasText;
		}
	}
</style>
