<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { ThemeMode } from '$lib/types.js';
	import Layout from './components/layout/layout.svelte';
	import { Theme } from '$lib/index.js';

	let { children }: { children: Snippet } = $props();
	const theme = $state<{ mode: ThemeMode }>({ mode: 'auto' });
	setContext('documentation-theme', theme);
</script>

<Theme><Layout>{@render children()}</Layout></Theme>
