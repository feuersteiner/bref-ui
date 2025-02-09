<script lang="ts">
	import Button from './button.svelte';
	import type { IButtonRowProps } from './types.js';

	const {
		primaryButton,
		secondaryButton,
		size = 'small',
		align = 'center'
	}: IButtonRowProps = $props();
	const shouldRenderPrimaryButton = primaryButton !== undefined;
	const shouldRenderSecondaryButton = secondaryButton !== undefined;
	const shouldRenderButtons = shouldRenderPrimaryButton || shouldRenderSecondaryButton;
</script>

{#if shouldRenderButtons}
	<div class={align}>
		{#if shouldRenderPrimaryButton}
			<Button {...primaryButton} {size} />
		{/if}
		{#if shouldRenderSecondaryButton}
			<Button {...secondaryButton} {size} />
		{/if}
	</div>
{/if}

<style>
	div {
		display: flex;
		gap: 1rem;
		width: 100%;
	}

	.center {
		justify-content: center;
	}
	.left {
		justify-content: flex-start;
	}
	.right {
		justify-content: flex-end;
	}
	
	@media (max-width: 640px) {
		div {
			flex-direction: column;
			justify-content: center;
		}
	}
</style>
