<script lang="ts">
	import Kinetic from '../components/kinetic.svelte';
	import { ease } from '../timeline.js';
	let { time }: { time: number } = $props();
	const actions = [
		{ text: 'File an issue.', url: 'https://github.com/feuersteiner/bref-ui/issues' },
		{ text: 'Join Discord.', url: 'https://discord.gg/JpgQRTUsVS' },
		{ text: 'Use it. Share it.', url: 'https://feuersteiner.github.io/bref-ui/' },
		{ text: 'Star it on GitHub.', url: 'https://github.com/feuersteiner/bref-ui' }
	];
	const index = $derived(Math.floor(time / 1.1));
</script>

<div class="type-screen closing">
	{#if time < 4.4}{#key index}<a href={actions[index].url}>
				<Kinetic text={actions[index].text} time={time - index * 1.1} speed={44} leave={0.86} />
			</a>{/key}
	{:else if time >= 4.85 && time < 7.9}<Kinetic
			text="Build cool shit ;)"
			time={time - 4.85}
			speed={28}
			leave={2.6}
		/>
	{:else if time >= 8.35}<div
			class="logo"
			style:opacity={ease((time - 8.35) / 0.3) * (1 - ease((time - 10.6) / 0.3))}
		>
			bref
			<span>/</span>
			ui
		</div>{/if}
</div>
