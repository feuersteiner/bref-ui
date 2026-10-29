<script lang="ts">
	import Kinetic from './kinetic.svelte';
	import { smooth } from '../timeline.js';
	let {
		text,
		elapsed,
		duration,
		morph = false
	}: { text: string; elapsed: number; duration: number; morph?: boolean } = $props();
	const p = $derived(morph ? smooth((elapsed - 0.5) / (duration - 0.8)) : 1);
</script>

<header
	class="chapter-context"
	style:left={`${960 - 908 * p}px`}
	style:top={`${440 - 408 * p}px`}
	style:transform={`translateX(${-50 * (1 - p)}%)`}
	style:font-size={`${140 - 96 * p}px`}
>
	<h1><Kinetic {text} time={morph ? elapsed : 2} /></h1>
</header>

<style>
	header {
		position: absolute;
		z-index: 40;
		pointer-events: none;
		white-space: nowrap;
		font-weight: 600;
	}
	h1 {
		font: inherit;
		letter-spacing: -0.04em;
	}
	h1 :global(.kinetic) {
		font: inherit;
		letter-spacing: inherit;
		text-align: left;
	}
</style>
