<script lang="ts">
	import { ease, type Scene } from './timeline.js';
	import Opening from './scenes/opening.svelte';
	import Demos from './scenes/demos.svelte';
	import Chapter from './scenes/chapter.svelte';
	import Terminal from './scenes/terminal.svelte';
	import Composition from './scenes/composition.svelte';
	import Files from './scenes/files.svelte';
	import ThemeShowcase from './scenes/theme-showcase.svelte';
	import Closing from './scenes/closing.svelte';

	let {
		scene,
		time,
		seconds,
		playing
	}: { scene: Scene; time: number; seconds: number; playing: boolean } = $props();
	const dark = $derived(['vscode', 'cli', 'install', 'own-title'].includes(scene.id));
	const arrival = $derived(ease(time / 0.65));
</script>

<article
	class={['film', { dark }]}
	aria-label={scene.label}
	style:--drift={`${Math.sin(seconds / 12) * 160}px`}
>
	<div class="ambient ambient-one"></div>
	<div class="ambient ambient-two"></div>
	<header class="film-header">
		<div class="wordmark">
			bref
			<span>/</span>
			ui
			<span class="wordmark-dot">●</span>
		</div>
		<p>
			SMALL COMPONENTS. <span>ENDLESS POSSIBILITIES.</span>
		</p>
	</header>
	<div
		class="scene"
		style:opacity={arrival}
		style:transform={`translateY(${(1 - arrival) * 28}px)`}
	>
		{#key scene.id}
			{#if scene.id === 'intro' || scene.id === 'demos'}
				<Opening id={scene.id} {time} />
			{:else if ['todo', 'shop', 'runner'].includes(scene.id)}
				<Demos id={scene.id} {time} {playing} />
			{:else if scene.id.endsWith('-title')}
				<Chapter chapter={scene.chapter} {time} />
			{:else if scene.id === 'install' || scene.id === 'cli'}
				<Terminal id={scene.id} {time} />
			{:else if ['compose', 'customize', 'modes', 'own-compose'].includes(scene.id)}
				<Composition id={scene.id} {time} />
			{:else if scene.id === 'files'}
				<Files {time} />
			{:else if ['paris', 'vscode', 'glassy'].includes(scene.id)}
				<ThemeShowcase id={scene.id} {time} />
			{:else}
				<Closing {time} />
			{/if}
		{/key}
	</div>
	<footer class="film-footer">
		<span>
			{['MEET BREF', '01 / IMPORT & USE', '02 / OWN THE CODE', '03 / FIND YOUR THEME', 'YOUR TURN'][
				scene.chapter
			]}
		</span>
		<div class="chapter-dots">
			{#each [0, 1, 2, 3, 4] as chapter (chapter)}<i
					class:current={scene.chapter === chapter}
				></i>{/each}
		</div>
		<span>SVELTE FIRST. HUMAN FIRST. AGENT FIRST.</span>
	</footer>
</article>
