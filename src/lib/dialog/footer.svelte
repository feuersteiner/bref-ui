<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '../button/button.svelte';
	import type { ButtonProps, Variant } from '../types.js';
	import type { DialogProps } from './types.js';

	let { footer }: { footer: NonNullable<DialogProps['footer']> } = $props();
	const isSnippet = (value: NonNullable<DialogProps['footer']>): value is Snippet =>
		typeof value === 'function';
	type Action = Exclude<NonNullable<DialogProps['footer']>, Snippet>['primary'];
	// Pick<ButtonProps> loses Button's required union branches; the action API stays intentionally narrow.
	const buttonProps = (action: Action, variant: Variant): ButtonProps =>
		({ ...action, size: 'small', variant }) as ButtonProps;
</script>

<footer>
	{#if isSnippet(footer)}
		{@render footer()}
	{:else}
		<Button {...buttonProps(footer.secondary, 'neutral')} />
		<Button {...buttonProps(footer.primary, 'filled')} />
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
