<script lang="ts">
	import Cursor from '../components/cursor.svelte';
	import Kinetic from '../components/kinetic.svelte';
	import { motion, type Keyframe } from '../motion.js';
	import shots from '../../public/footage/shots.json';
	let { id, time, playing }: { id: string; time: number; playing: boolean } = $props();
	let video: HTMLVideoElement;
	const focus = $derived(shots[id as keyof typeof shots]);
	const local = $derived(Math.max(0, time - 3));
	const title = $derived(
		id === 'todo' ? 'Todo app.' : id === 'shop' ? 'Ecommerce shop.' : 'SaaS AI app.'
	);
	const path = $derived<readonly Keyframe[]>([
		[0, 1730, 950],
		[5, 1730, 950],
		[6.5, focus.first[0], focus.first[1]],
		[8.3, focus.first[0], focus.first[1]],
		[9.8, focus.second[0], focus.second[1]],
		[14, focus.second[0], focus.second[1]]
	]);
	const point = $derived(motion(local, path));
	$effect(() => {
		if (!video) return;
		if (playing && time >= 3) void video.play().catch(() => {});
		else video.pause();
	});
</script>

<div class="demo-shot" style:opacity={time >= 3 ? 1 : 0}>
	<video
		bind:this={video}
		data-offset="3"
		src={`./footage/${id}.mp4`}
		muted
		playsinline
		preload="auto"
		aria-label={`${id} running application`}
	>
		<track kind="captions" />
	</video>
	<Cursor time={local} path={[[0, point.x, point.y]]} clicks={[6.5, 9.8]} visible={local >= 5} />
</div>
{#if time < 3}<div class="type-screen">
		<Kinetic text={title} {time} speed={25} leave={2.55} />
	</div>{/if}
