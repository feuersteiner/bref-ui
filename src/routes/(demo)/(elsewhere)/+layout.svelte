<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Theme, ThemeModeToggle } from '$lib/index.js';
	import '@fontsource-variable/syne';
	import '@fontsource-variable/inter';
	import './theme.css';
	let { children }: { children: Snippet } = $props();
</script>

<Theme
	palette={{
		primary: '#6250aa',
		secondary: '#54697a',
		background: '#f7f7fb',
		foreground: '#292739',
		muted: '#686575',
		success: '#386852'
	}}
>
	<ThemeModeToggle mode="light" />
	<div data-elsewhere>{@render children()}</div>
</Theme>
