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

	:focus-visible:not(input):not(textarea) {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::after {
			transition: none;
			animation: none;
		}
	}
	@media (forced-colors: active) {
		:focus-visible:not(input):not(textarea) {
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
