<script lang="ts">
	import Cursor from '../components/cursor.svelte';
	import shots from '../../public/footage/shots.json';
	let { time, playing, rate }: { time: number; playing: boolean; rate: number } = $props();
	let videos: HTMLVideoElement[] = [];
	const demos = [
		{ id: 'todo', title: 'Todo app.', action: 'Complete a task. Add another.' },
		{ id: 'shop', title: 'Ecommerce shop.', action: 'Explore the collection. Add to cart.' },
		{ id: 'runner', title: 'SaaS AI app.', action: 'Retry a run. Inspect a workflow.' }
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
		<section class="demo-column" aria-label={demo.title}>
			<h2>{demo.title}</h2>
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
							[0, 1730, 950],
							[5, 1730, 950],
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
			<p>{demo.action}</p>
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
		gap: 36px;
	}
	h2 {
		font-size: 46px;
		letter-spacing: -2px;
	}
	p {
		font-size: 24px;
	}
	.demo-frame {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: 12px;
	}
	.demo-shot {
		transform: scale(0.3083333333);
	}
</style>
