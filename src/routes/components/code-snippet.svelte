<script lang="ts">
	let { source }: { source: string } = $props();
	let feedback = $state('');

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(source);
			feedback = 'Copied.';
		} catch {
			feedback = 'Copy failed. Select and copy the code manually.';
		}
	};
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (Allow keyboard scrolling of wide code blocks.) -->
<pre role="region" aria-label="Code snippet" tabindex="0"><code>{source}</code></pre>
<button type="button" onclick={copy}>Copy code</button>
<p role="status">{feedback}</p>

<style>
	pre {
		overflow-x: auto;
	}
</style>
