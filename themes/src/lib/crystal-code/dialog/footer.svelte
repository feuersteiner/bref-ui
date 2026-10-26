<script lang="ts">
	import Button from '../button/button.svelte';
	import type { DialogProps } from 'bref-ui/types';

	let { footer }: { footer: NonNullable<DialogProps['footer']> } = $props();
</script>

<footer>
	{#if typeof footer === 'function'}
		{@render footer()}
	{:else}
		<Button {...footer.secondary} size="small" variant="neutral" />
		<Button
			{...footer.primary}
			color={footer.primary.color ?? 'primary'}
			size="small"
			variant="filled"
		/>
	{/if}
</footer>

<style>
	footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 0 1.75rem 1.5rem;
	}

	:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: 3px;
	}
	footer {
		padding: 0 24px 22px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (forced-colors: active) {
		:focus-visible {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none;
			transition: none;
		}
	}
</style>
