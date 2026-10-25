<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div data-relay>{@render children()}</div>

<style>
	[data-relay] {
		--relay-rule: color-mix(in srgb, var(--color-foreground) 9%, transparent);
		--relay-panel: color-mix(in srgb, white 65%, transparent);
		min-height: calc(100dvh - 43px);
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
