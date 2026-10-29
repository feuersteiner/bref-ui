<script lang="ts">
	import { clamp, smooth } from '../timeline.js';
	let {
		text,
		time,
		speed = 40,
		leave = Infinity,
		class: className = ''
	}: { text: string; time: number; speed?: number; leave?: number; class?: string } = $props();
	const words = $derived(text.split(' '));
	const exit = $derived(smooth((time - leave) / 0.24));
</script>

<div
	class={['kinetic', className]}
	aria-label={text}
	style:opacity={1 - exit}
	style:transform={`translateY(${-60 * exit}px)`}
>
	{#each words as word, index (index)}
		{@const p = smooth((time - (index * 3) / speed) / 0.38)}
		<span class="word-mask" aria-hidden="true">
			<span
				class:accent={index === words.length - 1}
				style:opacity={clamp(p * 4)}
				style:transform={`translateY(${(1 - p) * 115}%) rotate(${(1 - p) * 4}deg)`}
				style:--fill={`${smooth((time - 0.2 - (index * 3) / speed) / 0.5) * 100}%`}
			>
				{word + (index < words.length - 1 ? ' ' : '')}
			</span>
		</span>
	{/each}
</div>

<style>
	.word-mask {
		display: inline-block;
		overflow: hidden;
		vertical-align: bottom;
		padding: 0.08em 0.035em;
		margin: -0.08em -0.035em;
	}
	.word-mask > span {
		display: inline-block;
	}
	.accent {
		font-family: Georgia, 'Times New Roman', serif;
		font-weight: 400;
		font-style: italic;
		letter-spacing: -0.045em;
		background: linear-gradient(
			90deg,
			var(--headline-accent, #dae2b3) var(--fill),
			transparent var(--fill)
		);
	}
</style>
