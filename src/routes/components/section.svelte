<script lang="ts">
	import type { Snippet } from 'svelte';

	let { id, title, children }: { id: string; title: string; children: Snippet } = $props();
</script>

<section aria-labelledby={id}>
	<h2 {id}>{title}</h2>
	{@render children()}
</section>

<style>
	section {
		display: grid;
		gap: 1rem;
		min-width: 0;
	}
</style>
