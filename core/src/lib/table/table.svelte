<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';

	let { children, ...attributes }: HTMLTableAttributes = $props();
</script>

<table {...attributes}>
	{@render children?.()}
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		color: var(--color-foreground, inherit);
		font: inherit;
		text-align: start;
	}
	table :global(caption) {
		padding-block: 0 0.75rem;
		font-weight: 600;
		text-align: start;
	}
	table :global(th),
	table :global(td) {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-foreground, black) 16%, transparent);
		vertical-align: top;
	}
	table :global(th) {
		font-weight: 600;
		text-align: inherit;
	}
	table :global(thead),
	table :global(tfoot) {
		background: color-mix(in srgb, var(--color-foreground, black) 4%, transparent);
	}
	@media (forced-colors: active) {
		table :global(th),
		table :global(td) {
			border-color: CanvasText;
		}
	}
</style>
