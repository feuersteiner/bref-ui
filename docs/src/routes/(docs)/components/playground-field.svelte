<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id,
		label,
		toggle = false,
		children
	}: { id: string; label: string; toggle?: boolean; children: Snippet } = $props();
</script>

<div data-toggle={toggle}>
	{#if toggle}
		{@render children()}
		<label for={id}>{label}</label>
	{:else}
		<label for={id}>{label}</label>
		{@render children()}
	{/if}
</div>

<style>
	div {
		display: grid;
		gap: 8px;
		min-width: 0;
		font-size: 13px;
		line-height: 20px;
	}
	div[data-toggle='true'] {
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 10px;
	}
	label {
		cursor: pointer;
	}
</style>
