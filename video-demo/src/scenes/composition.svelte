<script lang="ts">
	import Editor from '../components/editor.svelte';
	import Signup from '../components/signup.svelte';
	import Cursor from '../components/cursor.svelte';
	import { componentSource, modeSource, paletteSource } from '../code.js';
	import { smooth, typeChars } from '../timeline.js';
	import { palettes } from '../palettes.js';
	let { id, time }: { id: string; time: number } = $props();
	let chosen = $state<number>();
	let manualDark = $state<boolean>();
	const typing = $derived(id !== 'customize');
	const progress = $derived(time / 8);
	const split = $derived(typing ? smooth((time - 8.4) / 1.6) : 1);
	const paletteIndex = $derived(chosen ?? (typing ? 0 : time >= 6.4 ? 2 : time >= 3.6 ? 1 : 0));
	const dark = $derived(manualDark ?? (!typing && time >= 9.2));
	const source = $derived(
		typing
			? typeChars(componentSource(id === 'own-compose'), progress)
			: dark
				? modeSource(true)
				: paletteSource(palettes[paletteIndex].primary, palettes[paletteIndex].background)
	);
</script>

<div class="composition" class:customizing={!typing} style:--split={split}>
	<div class="composition-source"><Editor {source} cursor={typing && progress < 1} /></div>
	<div class="composition-preview" style:transform={`translateX(${(1 - split) * 100}%)`}>
		<Signup {dark} {paletteIndex} time={typing ? time : 18} />
	</div>
	{#if !typing}<div class="palette-controls">
			{#each palettes as palette, index (palette.name)}<button
					class:chosen={paletteIndex === index}
					style:--swatch={palette.primary}
					onclick={() => (chosen = index)}
					aria-label={palette.name}
				></button>{/each}
			<button
				class="dark-toggle"
				class:chosen={dark}
				onclick={() => (manualDark = !dark)}
				aria-label="Toggle dark mode"
			>
				<svg
					viewBox="0 0 24 24"
					width="28"
					height="28"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
				</svg>
			</button>
		</div>{/if}
	<Cursor
		{time}
		path={typing
			? [
					[0, 1800, 950],
					[10, 1800, 950],
					[10.7, 1497, 549],
					[13.4, 1497, 549],
					[14.2, 1202, 633],
					[15.2, 1202, 633],
					[16, 1480, 788],
					[18, 1480, 788]
				]
			: [
					[0, 1800, 950],
					[1.2, 1248, 952],
					[2.4, 1248, 952],
					[3.6, 1384, 952],
					[5.2, 1384, 952],
					[6.4, 1520, 952],
					[8, 1520, 952],
					[9.2, 1656, 952],
					[12, 1656, 952]
				]}
		clicks={typing ? [10.7, 14.2, 16] : [1.2, 3.6, 6.4, 9.2]}
		visible={!typing || time >= 10}
	/>
</div>
