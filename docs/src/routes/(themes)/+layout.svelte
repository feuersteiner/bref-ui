<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
<footer>
	<a href={resolve('themes')}>Back to Bref docs</a>
</footer>

<style>
	footer {
		padding: 16px 24px;
		border-top: 1px solid currentColor;
		font:
			400 14px/1.6 system-ui,
			sans-serif;
	}
	a {
		color: inherit;
		text-underline-offset: 4px;
	}
</style>
