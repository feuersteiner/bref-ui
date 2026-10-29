<script lang="ts">
	import { ease, typeWords } from '../timeline.js';
	let { id, time }: { id: string; time: number } = $props();
</script>

{#if id === 'intro'}
	<div class="opening">
		<div
			class="opening-mark"
			style:opacity={ease(time / 1.2)}
			style:transform={`scale(${0.88 + ease(time / 1.4) * 0.12})`}
		>
			bref
			<span>/</span>
			ui
			<span class="opening-dot">●</span>
		</div>
		<div class="values">
			{#each ['Human first.', 'Svelte first.', 'Agent first.'] as value, index (value)}
				<span class:accent={index === 1}>
					{typeWords(value, (time - 1.7 - index * 1.15) / 0.85)}
					<span
						class="type-cursor"
						class:invisible={time > 2.6 + index * 1.15 || time < 1.7 + index * 1.15}
					>
						▎
					</span>
				</span>
			{/each}
		</div>
		<p class="intro-caption" style:opacity={ease((time - 5.4) / 0.7)}>
			A Svelte UI library. Made to become your own.
		</p>
		<div class="intro-badges" style:opacity={ease((time - 6) / 0.6)}>
			<span>SVELTE 5</span>
			<span>NATIVE CSS</span>
			<span>OPEN SOURCE</span>
		</div>
	</div>
{:else}
	<div class="title-screen">
		<p class="eyebrow">ENOUGH TALK. HERE’S THE GOOD STUFF.</p>
		<h1>
			See what
			<br />
			you can
			<em>build.</em>
		</h1>
		<div class="title-arrow" style:transform={`translateX(${ease(time) * 35}px)`}>↗</div>
	</div>
{/if}
