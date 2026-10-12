<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Theme, ThemeModeToggle } from '$lib/index.js';
	import '@fontsource-variable/inter';
	import './theme.css';
	let { children }: { children: Snippet } = $props();
</script>

<Theme
	palette={{
		primary: '#375b86',
		secondary: '#695985',
		background: '#f3f6fa',
		foreground: '#263346',
		muted: '#59677b',
		success: '#326b58'
	}}
>
	<ThemeModeToggle mode="light" />
	<div data-relay>{@render children()}</div>
</Theme>
