<script lang="ts">
	import type { ThemeModeToggleProps } from '#bref-types';

	let { mode = 'auto' }: ThemeModeToggleProps = $props();
</script>

<svelte:head>
	<meta name="color-scheme" content={mode === 'auto' ? 'light dark' : mode} />
</svelte:head>
