<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, children }: { title: string; children: Snippet } = $props();
</script>

<fieldset>
	<legend>{title}</legend>
	{@render children()}
</fieldset>

<style>
	fieldset {
		display: grid;
		gap: 12px;
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}
	legend {
		margin-bottom: 12px;
		padding: 0;
		font: 500 14px / 20px var(--font-text);
	}
</style>
