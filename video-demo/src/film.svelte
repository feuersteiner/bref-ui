<script lang="ts">
	import type { Scene } from './timeline.js';
	import Opening from './scenes/opening.svelte';
	import Demos from './scenes/demos.svelte';
	import Chapter from './scenes/chapter.svelte';
	import Terminal from './scenes/terminal.svelte';
	import Composition from './scenes/composition.svelte';
	import Files from './scenes/files.svelte';
	import ThemeShowcase from './scenes/theme-showcase.svelte';
	import Closing from './scenes/closing.svelte';
	let { scene, time, playing }: { scene: Scene; time: number; playing: boolean } = $props();
	const dark = $derived(['cli', 'install', 'theme-install', 'end'].includes(scene.id));
</script>

<article class={['film', { dark }]} aria-label={scene.label}>
	<div class="scene">
		{#key scene.id}
			{#if scene.id === 'intro' || scene.id === 'demos'}<Opening id={scene.id} {time} />
			{:else if ['todo', 'shop', 'runner'].includes(scene.id)}<Demos
					id={scene.id}
					{time}
					{playing}
				/>
			{:else if scene.id.endsWith('-title')}<Chapter chapter={scene.chapter} {time} />
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
				/>
			{:else}<Closing {time} />{/if}
		{/key}
	</div>
</article>
