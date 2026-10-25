<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div data-elsewhere>{@render children()}</div>

<style>
	[data-elsewhere] {
		--monitor-rule: color-mix(in srgb, var(--color-primary) 14%, transparent);
		--run-rule: #e8e5ef;
		--run-line: #d2cbdc;
		--run-dot: #ded9e8;
		--run-surface: #fff;
		--run-tint: #eeebf5;
		--monitor-surface: rgb(255 255 255 / 82%);
		min-height: 0;
		background: var(--color-background);
		color: var(--color-foreground);
		font:
			400 14px/1.6 'Inter Variable',
			sans-serif;
	}
	@media (max-width: 600px) {
		[data-elsewhere] {
			min-height: 0;
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		[data-elsewhere] {
			--monitor-surface: white;
		}
	}
</style>
