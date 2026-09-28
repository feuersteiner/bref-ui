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
		position: relative;
		display: grid;
		gap: 24px;
		min-width: 0;
		padding: 24px 24px 0;
	}
	section::before {
		position: absolute;
		inset: 0 0 auto;
		border-top: 1px solid var(--docs-rule);
		content: '';
		pointer-events: none;
	}
	h2 {
		max-width: 720px;
		letter-spacing: -0.025em;
		scroll-margin-top: 120px;
	}
	section > :global(p) {
		max-width: 672px;
	}
	@media (max-width: 575px) {
		section {
			padding-inline: 0;
		}
	}
</style>
