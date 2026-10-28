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
		flex-shrink: 0;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 0 24px 22px;
	}
</style>
