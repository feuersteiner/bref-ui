<script lang="ts">
	import { ease } from '../timeline.js';
	let { id, time, playing }: { id: string; time: number; playing: boolean } = $props();
	let video: HTMLVideoElement;
	const demos: Record<string, { name: string; tagline: string; number: string }> = {
		todo: { name: 'Todo', tagline: 'A little order. A lot more flow.', number: '01' },
		shop: { name: 'House Shop', tagline: 'Good design. From browse to basket.', number: '02' },
		runner: { name: 'RunnerAI', tagline: 'Big ideas. Agents in motion.', number: '03' }
	};
	$effect(() => {
		if (!video) return;
		if (playing) void video.play().catch(() => {});
		else video.pause();
	});
</script>

<div class="demo-heading">
	<p class="eyebrow">
		BUILT WITH BREF <span>/ {demos[id].number}</span>
	</p>
	<h1>
		{demos[id].name}
		<span>↗</span>
	</h1>
	<p>{demos[id].tagline}</p>
</div>
<div
	class="demo-browser"
	style:transform={`perspective(2400px) rotateX(${(1 - ease(time / 0.7)) * 6}deg) scale(${0.96 + ease(time / 0.7) * 0.04})`}
>
	<div class="browser-chrome">
		<span class="traffic-lights">● ● ●</span>
		<span>bref-ui / demos / {demos[id].name}</span>
		<span>↗</span>
	</div>
	<video
		bind:this={video}
		src={`./footage/${id}.mp4`}
		muted
		playsinline
		preload="auto"
		aria-label={`${demos[id].name} running application`}
	>
		<track kind="captions" />
	</video>
</div>
