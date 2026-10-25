<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Run } from './run-state.svelte.js';
	import RunSteps from './run-steps.svelte';
	let {
		run,
		selectedIndex,
		onSelect
	}: { run: Run; selectedIndex: number; onSelect: (index: number) => void } = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable workflow needs keyboard access.) -->
<section
	in:fly={{
		y: prefersReducedMotion.current ? 0 : 6,
		duration: prefersReducedMotion.current ? 0 : 180
	}}
	aria-label="Workflow canvas"
	data-output
	tabindex="0"
>
	<h3>Workflow</h3>
	<RunSteps {run} {selectedIndex} {onSelect} />
</section>

<style>
	section {
		container-type: inline-size;
		min-width: 0;
		min-height: 0;
		overflow: auto;
		border-radius: var(--run-inner-radius);
		scroll-padding: 12px;
		padding: 20px;
		background: var(--run-surface);
		background-image: radial-gradient(
			color-mix(in srgb, var(--color-primary) 13%, transparent) 0.7px,
			transparent 0.7px
		);
		background-size: 20px 20px;
		overscroll-behavior: contain;
		scrollbar-width: thin;
	}
	h3 {
		margin: 0;
		color: var(--color-muted);
		font-size: 12px;
		line-height: 18px;
		font-weight: 500;
	}
	section:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -4px;
	}
</style>
