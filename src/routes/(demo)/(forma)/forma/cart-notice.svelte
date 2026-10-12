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
