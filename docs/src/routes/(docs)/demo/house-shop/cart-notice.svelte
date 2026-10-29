<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	let { message, sequence }: { message: string; sequence: number } = $props();
	let notices = $state<{ message: string; sequence: number }[]>([]);
	$effect(() => {
		if (!message || !sequence) return;
		notices = [{ message, sequence }];
		const timeout = setTimeout(() => (notices = []), 3200);
		return () => clearTimeout(timeout);
	});
</script>

<div data-notice-position role="status" aria-live="polite" aria-atomic="true">
	{#each notices as notice (notice.sequence)}
		<p
			data-store-status
			transition:fly={{
				y: prefersReducedMotion.current ? 0 : 44,
				duration: prefersReducedMotion.current ? 0 : 440
			}}
		>
			{notice.message}
		</p>
	{/each}
</div>

<style>
	p {
		line-height: 1.7;
	}
	[data-notice-position] {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		width: max-content;
		max-width: calc(100% - 32px);
		display: grid;
		pointer-events: none;
	}
	[data-store-status] {
		grid-area: 1 / 1;
		padding: 12px 18px;
		border: 1px solid var(--forma-rule);
		border-radius: 24px;
		background: var(--color-background);
		box-shadow: 0 4px 24px #0000000d;
		font-size: 12px;
	}
</style>
