<script lang="ts">
	import Theme from '$lib/theme.svelte';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<Theme>
	{@render children()}
</Theme>
