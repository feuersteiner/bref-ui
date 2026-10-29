<script lang="ts">
	import { smooth } from '../timeline.js';
	import { Icon } from 'bref-ui';
	import Kinetic from '../components/kinetic.svelte';
	import Cursor from '../components/cursor.svelte';
	import shots from '../../public/footage/shots.json';
	let {
		time,
		elapsed,
		playing,
		rate
	}: { time: number; elapsed: number; playing: boolean; rate: number } = $props();
	let videos: HTMLVideoElement[] = [];
	const demos = [
		{ id: 'todo', title: 'Todo app.', icon: 'checklist' },
		{ id: 'shop', title: 'Ecommerce shop.', icon: 'storefront' },
		{ id: 'runner', title: 'SaaS AI app.', icon: 'auto_awesome' }
	] as const;
	$effect(() => {
		for (const video of videos) {
			if (!video) continue;
			video.playbackRate = rate;
			if (playing) void video.play().catch(() => {});
			else video.pause();
		}
	});
</script>

<div class="demo-grid">
	{#each demos as demo, index (demo.id)}
		{@const focus = shots[demo.id]}
		{@const entrance = smooth((elapsed - 0.1 - index * 0.2) / 0.6)}
		<section
			class="demo-column"
			aria-label={demo.title}
			style:opacity={entrance}
			style:transform={`translateY(${(1 - entrance) * 1120}px) rotate(${(1 - entrance) * 2}deg)`}
		>
			<h2>
				<Icon name={demo.icon} filled /><Kinetic
					text={demo.title}
					time={elapsed - 0.1 - index * 0.2}
				/>
			</h2>
			<div class="demo-frame">
				<div class="demo-shot">
					<video
						bind:this={videos[index]}
						src={`./footage/${demo.id}.mp4`}
						muted
						playsinline
						preload="auto"
						aria-label={`${demo.id} running application`}
					>
						<track kind="captions" />
					</video>
					<Cursor
						{time}
						path={[
							[0, 690, 1020],
							[5, 690, 1020],
							[6.5, focus.first[0], focus.first[1]],
							[8.3, focus.first[0], focus.first[1]],
							[9.8, focus.second[0], focus.second[1]],
							[14, focus.second[0], focus.second[1]]
						]}
						clicks={[6.5, 9.8]}
						visible={time >= 5}
					/>
				</div>
			</div>
		</section>
	{/each}
</div>

<style>
	.demo-grid {
		height: 100%;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		align-items: center;
		gap: 24px;
		padding: 48px;
	}
	section {
		display: grid;
		gap: 24px;
	}
	h2 {
		display: flex;
		align-items: center;
		gap: 16px;
		font-size: 42px;
		letter-spacing: -2px;
	}
	.demo-frame {
		position: relative;
		aspect-ratio: 2 / 3;
		overflow: hidden;
		border-radius: 12px;
	}
	.demo-shot {
		width: 768px;
		height: 1152px;
		transform: scale(0.7708333333);
	}
	.demo-shot > video {
		width: 768px;
		height: 1152px;
	}
	h2 :global(.kinetic) {
		font: inherit;
		letter-spacing: inherit;
		text-align: left;
	}
</style>
