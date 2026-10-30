<script lang="ts">
	import CodeSnippet from './code-snippet.svelte';
	let { usage, example }: { usage: string; example?: number } = $props();
	const parts = $derived(usage.split(/```([^\n]*)\n([\s\S]*?)```/));
</script>

{#each parts as part, index (index)}
	{#if index % 3 === 0 && (example === undefined || example === 0)}
		{#each part.trim().split(/\n\n+/).filter(Boolean) as paragraph, paragraphIndex (paragraphIndex)}
			<p>{paragraph}</p>
		{/each}
	{:else if index % 3 === 2 && (example === undefined || Math.floor(index / 3) === example)}
		<CodeSnippet
			source={part.trimEnd()}
			language={parts[index - 1] === 'svelte' ? 'svelte' : 'text'}
		/>
	{/if}
{/each}
