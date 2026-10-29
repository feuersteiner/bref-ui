<script lang="ts">
	import { tokenize } from '../code.js';
	let {
		source,
		filename = '+page.svelte',
		cursor = false
	}: { source: string; filename?: string; cursor?: boolean } = $props();
</script>

<div class="editor-window">
	<div class="editor-chrome">
		<span class="editor-tab">
			<span class="svelte-dot">●</span>
			{filename}
			<span>×</span>
		</span>
		<span>SVELTE 5</span>
	</div>
	<div class="editor-code" aria-label={`${filename} source code`}>
		{#each source.split('\n') as line, index (index)}
			<div class="code-line">
				<span class="line-number">{index + 1}</span>
				<pre>{#each tokenize(line) as token, tokenIndex (tokenIndex)}<span
							class={`syntax-${token.kind}`}>{token.text}</span>{/each}{#if cursor && index === source.split('\n').length - 1}<span
							class="code-cursor">▎</span>{/if}</pre>
			</div>
		{/each}
	</div>
	<div class="editor-status">
		<span>
			● Svelte <span>UTF-8</span>
		</span>
		<span>✓ Native CSS · typed props</span>
	</div>
</div>
