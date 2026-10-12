<script lang="ts">
	import type { Snippet } from 'svelte';
	import './theme.css';
	let { children }: { children: Snippet } = $props();
</script>

<div data-relay>{@render children()}</div>
