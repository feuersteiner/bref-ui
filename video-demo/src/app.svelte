<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Theme, ThemeModeToggle } from 'bref-ui';
	import Film from './film.svelte';
	import { clamp, duration, formatTime, locate, scenes, starts } from './timeline.js';
	import '@fontsource-variable/syne';
	import '@fontsource-variable/inter';
	import './styles/studio.css';
	import './styles/film.css';
	import './styles/panels.css';
	import './styles/showcases.css';

	const params = new URLSearchParams(location.search);
	const rendering = params.has('render');
	const requestedTime = Number(params.get('t') ?? 0);
	let seconds = $state(Number.isFinite(requestedTime) ? clamp(requestedTime, 0, duration) : 0);
	let playing = $state(!rendering && !matchMedia('(prefers-reduced-motion: reduce)').matches);
	let width = $state(1920);
	const current = $derived(locate(seconds));
	const seek = async (value: number) => {
		seconds = clamp(value, 0, duration);
		await tick();
		await document.fonts.ready;
		await Promise.all(
			Array.from(document.querySelectorAll<HTMLVideoElement>('video')).map(async (video) => {
				if (video.readyState < 1)
					await new Promise<void>((resolve, reject) => {
						video.addEventListener('loadedmetadata', () => resolve(), { once: true });
						video.addEventListener('error', () => reject(new Error('Demo footage failed.')), {
							once: true
						});
					});
				const target = Math.min(
					Math.max(0, current.time - Number(video.dataset.offset ?? 0)),
					Math.max(video.duration - 0.05, 0)
				);
				if (Math.abs(video.currentTime - target) < 0.005) return;
				await new Promise<void>((resolve) => {
					video.addEventListener('seeked', () => resolve(), { once: true });
					video.currentTime = target;
				});
			})
		);
	};
	const toggle = () => {
		if (seconds >= duration) seconds = 0;
		playing = !playing;
	};
	onMount(() => {
		window.__brefVideo = { duration, seek };
		void seek(seconds);
		let previous = performance.now();
		let frame = 0;
		const update = (now: number) => {
			if (playing) {
				seconds = Math.min(seconds + (now - previous) / 1000, duration);
				if (seconds === duration) playing = false;
			}
			previous = now;
			frame = requestAnimationFrame(update);
		};
		frame = requestAnimationFrame(update);
		return () => {
			cancelAnimationFrame(frame);
			delete window.__brefVideo;
		};
	});
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.target instanceof HTMLElement && event.target.closest('button,input,a,select'))
			return;
		if (event.code === 'Space') {
			event.preventDefault();
			toggle();
		}
		if (event.code === 'ArrowRight') seek(seconds + 5);
		if (event.code === 'ArrowLeft') seek(seconds - 5);
	}}
/>

<main class={['studio', { rendering }]}>
	<Theme />
	<ThemeModeToggle mode="light" />
	<div class="viewport" bind:clientWidth={width}>
		<div class="stage" style:transform={`scale(${width / 1920})`}>
			<Film {...current} {playing} />
		</div>
	</div>
	{#if !rendering}
		<section class="transport" aria-label="Video controls">
			<button
				class="play"
				onclick={toggle}
				aria-label={playing ? 'Pause showcase' : 'Play showcase'}
			>
				{playing ? 'Ⅱ' : '▶'}
			</button>
			<span class="timecode">{formatTime(seconds)}</span>
			<label class="seek-label">
				<span class="sr-only">Seek video</span>
				<input
					type="range"
					min="0"
					max={duration}
					step="0.01"
					value={seconds}
					oninput={(event) => seek(Number(event.currentTarget.value))}
				/>
			</label>
			<span class="timecode">{formatTime(duration)}</span>
			<span class="resolution">1080p · 30 fps</span>
		</section>
		<nav class="chapters" aria-label="Jump to chapter">
			{#each [0, 1, 2, 3, 4] as chapter (chapter)}
				{@const index = scenes.findIndex((scene) => scene.chapter === chapter)}
				<button
					class:active={current.scene.chapter === chapter}
					onclick={() => seek(starts[index])}
					aria-current={current.scene.chapter === chapter ? 'step' : undefined}
				>
					<span>0{chapter + 1}</span>
					{['Meet Bref', 'Import & use', 'Own the code', 'Find your theme', 'Build something'][
						chapter
					]}
				</button>
			{/each}
		</nav>
	{/if}
</main>
