<script lang="ts">
	import MiniForm from './mini-form.svelte';
	import { palettes } from '../palettes.js';
	let {
		dark = false,
		paletteIndex = 0,
		time = 18
	}: { dark?: boolean; paletteIndex?: number; time?: number } = $props();
	const custom = $derived(paletteIndex > 0 ? palettes[paletteIndex] : undefined);
</script>

<section
	class="signup-preview"
	data-theme={dark ? 'dark' : 'light'}
	style:--color-primary={custom
		? `light-dark(${custom.primary}, ${custom.darkPrimary})`
		: undefined}
	style:--color-background={custom
		? `light-dark(${custom.background}, ${custom.darkBackground})`
		: undefined}
	style:--color-foreground={custom
		? `light-dark(${custom.foreground}, ${custom.darkForeground})`
		: undefined}
>
	<div class="signup-card"><MiniForm {time} interactive /></div>
</section>
