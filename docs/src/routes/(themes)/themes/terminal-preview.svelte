<script lang="ts">
	import type { Component } from 'svelte';
	import type { TerminalProps } from 'bref-ui/types';

	let { Terminal, label }: { Terminal: Component<TerminalProps>; label: string } = $props();
	const initialLines = ['$ bun run dev', '✓ Components ready', '', 'A little room to build. ♡'];
	let lines = $state(initialLines);
</script>

<section aria-label={`${label} terminal examples`}>
	<h3>Terminal</h3>
	<p>A dark little viewport, in this theme's own handwriting. Output stays plain text.</p>
	<Terminal {lines} windowTitle={`${label} — terminal`} />
	<div>
		<button type="button" onclick={() => (lines = [...lines, `✓ Step ${lines.length + 1} ready`])}>
			Append line
		</button>
		<button type="button" onclick={() => (lines = [])}>Clear</button>
		<button type="button" onclick={() => (lines = initialLines)}>Reset output</button>
	</div>
	<details>
		<summary>Empty and overflowing output</summary>
		<Terminal lines={[]} windowTitle="" aria-label={`${label} empty terminal`} />
		<Terminal
			windowTitle={`${label} — a long window title with plenty of room for your imagination`}
			aria-label={`${label} overflowing terminal`}
			style="max-height: 10rem"
			lines={Array.from(
				{ length: 15 },
				(_, index) => `${index + 1}  ${'long output · '.repeat(12)}`
			)}
		/>
		<p>Tab into the viewport and use arrow keys to scroll. The dots are decorative.</p>
	</details>
</section>

<style>
	section {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1rem;
		min-width: 0;
		margin-block-start: 2rem;
	}
	h3,
	p {
		margin: 0;
	}
	p {
		font-size: 0.875rem;
		line-height: 1.6;
	}
	div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	button {
		padding: 0.625rem 0.875rem;
		border: 1px solid currentColor;
		border-radius: 0.375rem;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
	button:focus-visible,
	summary:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 3px;
	}
	details > :not(summary) {
		margin-block-start: 1rem;
	}
	details {
		min-width: 0;
	}
</style>
