<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, children }: { title: string; children: Snippet } = $props();
</script>

<div role="group" aria-label={title}>
	<h3>{title}</h3>
	{@render children()}
</div>

<style>
	div {
		position: relative;
		display: grid;
		gap: 20px;
		min-width: 0;
		padding-block: 8px;
	}
	h3 {
		font: 500 14px / 20px var(--font-text);
		color: var(--color-muted);
	}
</style>
