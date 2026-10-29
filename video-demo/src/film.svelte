<script lang="ts">
	import { smooth, type Scene } from './timeline.js';
	import Opening from './scenes/opening.svelte';
	import Demos from './scenes/demos.svelte';
	import ContextHeading from './components/context-heading.svelte';
	import Terminal from './scenes/terminal.svelte';
	import Composition from './scenes/composition.svelte';
	import Files from './scenes/files.svelte';
	import ThemeShowcase from './scenes/theme-showcase.svelte';
	import Closing from './scenes/closing.svelte';
	let {
		scene,
		time,
		elapsed,
		playing
	}: { scene: Scene; time: number; elapsed: number; playing: boolean } = $props();
	const enter = $derived(scene.id === 'intro' ? 1 : smooth(elapsed / 0.22));
	const leave = $derived(scene.id === 'end' ? 0 : smooth((elapsed - scene.duration + 0.22) / 0.22));
	const wipe = $derived(elapsed < 0.22 && scene.id !== 'intro' ? enter * 100 : -100 + leave * 100);
	const heading = $derived(
		scene.chapter === 1
			? scene.id === 'customize'
				? 'Customize your theme'
				: 'Import the components'
			: scene.chapter === 2
				? 'Own the code'
				: ''
	);
	const dark = $derived(['cli', 'install', 'theme-install'].includes(scene.id));
</script>

<article class={['film', { dark }]} aria-label={scene.label}>
	<div class="scene" style:transform={`translateX(${(1 - enter) * 100 - leave * 100}px)`}>
		{#key scene.id}
			{#if scene.id === 'intro' || scene.id === 'demos'}<Opening id={scene.id} {time} />
			{:else if scene.id === 'apps'}<Demos
					{time}
					{elapsed}
					{playing}
					rate={scene.sourceDuration / scene.duration}
				/>
			{:else if scene.id.endsWith('-title')}<!-- The persistent heading moves into its corner. -->
			{:else if ['install', 'cli', 'theme-install'].includes(scene.id)}<Terminal
					id={scene.id}
					{time}
				/>
			{:else if ['compose', 'customize', 'modes', 'own-compose'].includes(scene.id)}<Composition
					id={scene.id}
					{time}
				/>
			{:else if scene.id === 'files'}<Files {time} />
			{:else if ['paris', 'vscode', 'glassy'].includes(scene.id)}<ThemeShowcase
					id={scene.id}
					{time}
					{elapsed}
				/>
			{:else}<Closing {time} />{/if}
		{/key}
	</div>
	{#if heading}<ContextHeading
			text={heading}
			{elapsed}
			duration={scene.duration}
			morph={scene.id.endsWith('-title')}
		/>{/if}
	<div class="page-wipe" aria-hidden="true" style:transform={`translateX(${wipe}%)`}></div>
</article>

<style>
	.page-wipe {
		position: absolute;
		inset: 0;
		z-index: 100;
		background: #d9dfc8;
		pointer-events: none;
	}
</style>
