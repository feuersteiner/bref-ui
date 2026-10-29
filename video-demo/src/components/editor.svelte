<script lang="ts">
	import { tokenize } from '../code.js';
	let {
		source,
		filename,
		cursor = false
	}: { source: string; filename?: string; cursor?: boolean } = $props();
</script>

<div class="code-source" aria-label={filename ? `${filename} source code` : 'Svelte source code'}>
	{#if filename}<div class="source-filename">{filename}</div>{/if}
	<pre>{#each tokenize(source) as token, index (index)}<span
				class={`syntax-${token.kind}`}>{token.text}</span>{/each}{#if cursor}<span
				class="code-caret">▎</span>{/if}</pre>
</div>
