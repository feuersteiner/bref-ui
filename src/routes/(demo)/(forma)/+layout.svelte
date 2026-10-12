<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Theme, ThemeModeToggle } from '$lib/index.js';
	import '@fontsource-variable/bricolage-grotesque';
	import '@fontsource-variable/inter';
	import './theme.css';
	let { children }: { children: Snippet } = $props();
</script>

<Theme
	palette={{
		primary: '#252a26',
		secondary: '#775a44',
		background: '#ffffff',
		foreground: '#252a26',
		muted: '#666b65',
		success: '#356747'
	}}
>
	<ThemeModeToggle mode="light" />
	<div data-forma>{@render children()}</div>
</Theme>
