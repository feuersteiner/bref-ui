<script lang="ts">
	import Kinetic from '../components/kinetic.svelte';
	import { ease } from '../timeline.js';
	let { id, time }: { id: string; time: number } = $props();
</script>

{#if id === 'intro'}
	<div class="opening">
		<div
			class="logo"
			style:opacity={ease(time / 0.4)}
			style:transform={`scale(${0.82 + ease(time / 0.65) * 0.18})`}
		>
			bref
			<span>/</span>
			ui
		</div>
		<div class="values">
			{#each ['Human first.', 'Svelte first.', 'Agent first.'] as value, index (value)}<Kinetic
					text={value}
					time={time - 1 - index * 0.85}
					speed={24}
				/>{/each}
		</div>
	</div>
{:else}
	<div class="type-screen hype"><h1><Kinetic text="New demos" {time} /></h1></div>
{/if}

<style>
	h1 {
		font-size: 174px;
		font-weight: 600;
		letter-spacing: -9px;
	}
</style>
