<script lang="ts">
	import type { Snippet } from 'svelte';
	import StandaloneDemo from '../standalone-demo.svelte';
	let { children }: { children: Snippet } = $props();
</script>

<StandaloneDemo palette="relay">
	<div data-relay>{@render children()}</div>
</StandaloneDemo>

<style>
	[data-relay] {
		--relay-rule: color-mix(in srgb, var(--color-foreground) 9%, transparent);
		--relay-panel: color-mix(in srgb, white 65%, transparent);
		min-height: 0;
		font-family: 'Inter Variable', sans-serif;
		background:
			radial-gradient(ellipse at 90% 20%, #e5eafa, transparent 55%), var(--color-background);
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition-duration: 0ms;
		}
	}
</style>
