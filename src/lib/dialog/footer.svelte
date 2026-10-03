<script lang="ts">
	import Button from '../button/button.svelte';
	import type { DialogProps } from './types.js';

	let { footer }: { footer: NonNullable<DialogProps['footer']> } = $props();
</script>

<footer>
	{#if typeof footer === 'function'}
		{@render footer()}
	{:else}
		<Button {...footer.secondary} size="small" variant="neutral" />
		<Button {...footer.primary} size="small" variant="filled" />
	{/if}
</footer>

<style>
	footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem 1.5rem;
	}
</style>
