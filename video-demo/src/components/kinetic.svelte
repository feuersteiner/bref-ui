<script lang="ts">
	import { clamp, ease } from '../timeline.js';
	let {
		text,
		time,
		speed = 40,
		leave = Infinity,
		class: className = ''
	}: { text: string; time: number; speed?: number; leave?: number; class?: string } = $props();
	const exit = $derived(ease((time - leave) / 0.22));
</script>

<div
	class={['kinetic', className]}
	aria-label={text}
	style:opacity={1 - exit}
	style:transform={`translateY(${-110 * exit}px) scale(${1 + exit * 0.12})`}
>
	{#each Array.from(text) as letter, index (index)}
		{@const p = ease((time - index / speed) / 0.18)}
		{#if letter === '\n'}<br />{:else}<span
				aria-hidden="true"
				style:opacity={clamp((time - index / speed) * speed)}
				style:transform={`translateY(${(1 - p) * 65}px) rotate(${(1 - p) * (index % 2 ? 8 : -8)}deg)`}
			>
				{letter}
			</span>{/if}
	{/each}
</div>
