<script lang="ts">
	import type { Snippet } from 'svelte';
	import PreviewShell from '../(skins)/skins/+layout.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<PreviewShell>{@render children()}</PreviewShell>
