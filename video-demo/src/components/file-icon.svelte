<script lang="ts">
	let { folder = false }: { folder?: boolean } = $props();
</script>

<svg
	class="file-icon"
	viewBox="0 0 24 24"
	width="24"
	height="24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	aria-hidden="true"
>
	{#if folder}<path d="M3 6h7l2 3h9v11H3Z" />{:else}<path d="M5 2h9l5 5v15H5Z" />
		<path d="M14 2v6h5M8 13h8M8 17h6" />{/if}
</svg>
