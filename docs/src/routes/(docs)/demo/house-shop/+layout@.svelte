<script lang="ts">
	import '@fontsource-variable/bricolage-grotesque';
	import type { Snippet } from 'svelte';
	import StandaloneDemo from '../standalone-demo.svelte';
	let { children }: { children: Snippet } = $props();
</script>

<StandaloneDemo palette="forma">
	<div data-forma>{@render children()}</div>
</StandaloneDemo>

<style>
	[data-forma] {
		--forma-rule: color-mix(in srgb, var(--color-foreground) 12%, transparent);
		--forma-image-radius: 4px;
		font-family: 'Inter Variable', sans-serif;
	}
</style>
