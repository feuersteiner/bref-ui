<script lang="ts">
	import Editor from '../components/editor.svelte';
	import Signup from '../components/signup.svelte';
	import { componentSource, modeSource, paletteSource } from '../code.js';
	import { ease, typeWords } from '../timeline.js';
	let { id, time }: { id: string; time: number } = $props();
	const local = $derived(id === 'own-compose');
	const typing = $derived(id === 'compose' || local);
	const progress = $derived(typing ? Math.min(time / (local ? 8.5 : 10), 1) : 1);
	const colors = ['#7771d9', '#327e69', '#bd586d'] as const;
	const colorIndex = $derived(id === 'customize' ? Math.min(Math.floor(time / 2.2), 2) : 0);
	const dark = $derived(id === 'modes' && time > 3.2);
	const source = $derived(
		typing
			? typeWords(componentSource(local), progress)
			: id === 'customize'
				? paletteSource(colors[colorIndex])
				: modeSource(dark)
	);
	const heading = $derived(
		id === 'customize'
			? 'Your palette. Your personality.'
			: id === 'modes'
				? 'From day to night.'
				: local
					? 'Same components. Now local.'
					: 'Import. Compose. Ship.'
	);
</script>

<div class="composition-heading">
	<p class="eyebrow">{local ? '02 / OWN THE CODE' : '01 / IMPORT & USE'}</p>
	<h1>{heading}</h1>
	<p>
		{local
			? 'A familiar import. A whole new level of freedom.'
			: id === 'customize'
				? 'One change. A whole new mood.'
				: id === 'modes'
					? 'Light or dark. Always considered.'
					: 'Familiar HTML. Bindings that just work. Room for your ideas.'}
	</p>
</div>
<div class="composition-panels">
	<Editor
		{source}
		cursor={typing && progress < 1}
		filename={typing ? '+page.svelte' : '+layout.svelte'}
	/>
	<div class="composition-preview" style:opacity={ease((time - (typing ? 2.4 : 0)) / 0.7)}>
		<Signup
			{dark}
			color={colors[colorIndex]}
			step={typing ? Math.floor(progress * 4.8) : 4}
			{time}
		/>
	</div>
</div>
<div class="composition-note">
	{#if id === 'customize'}<div class="palette-swatches">
			{#each colors as color, index (color)}<span
					class:selected={colorIndex === index}
					style:background={color}
				></span>{/each}
		</div>
		<span>Semantic tokens. Every component follows.</span>
	{:else if id === 'modes'}<span class="mode-pill" class:mode-dark={dark}>
			{dark ? '☾ DARK MODE' : '☀ LIGHT MODE'}
		</span>
		<span>Same markup. Different atmosphere.</span>
	{:else}<span class="code-import">from '{local ? '#bref' : 'bref-ui'}'</span>
		<span>
			{local
				? 'Local, editable Svelte source. Shared types from bref-ui.'
				: 'No class vocabulary. No ceremony. Just Svelte.'}
		</span>{/if}
</div>
