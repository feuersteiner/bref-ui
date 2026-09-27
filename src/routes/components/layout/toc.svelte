<script lang="ts">
	import type { PageSection } from './navigation.js';
	import { getContext } from 'svelte';
	import { ThemeModeToggle } from '$lib/index.js';
	import type { ThemeMode } from '$lib/types.js';
	const theme = getContext<{ mode: ThemeMode }>('documentation-theme');

	let { sections }: { sections: readonly PageSection[] } = $props();
</script>

<ThemeModeToggle mode={theme.mode} />
<nav aria-label="On this page">
	<label
		>Theme
		<select bind:value={theme.mode}>
			<option value="auto">System</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</label>
	<h2>On this page</h2>
	<ul>
		{#each sections as section (section.id)}
			<li><a href={`#${section.id}`}>{section.title}</a></li>
		{/each}
	</ul>
</nav>
