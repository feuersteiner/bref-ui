<script lang="ts">
	import Showcase from './showcase.svelte';
</script>

<svelte:head>
	<title>VS Code theme | Bref</title>
	<meta
		name="description"
		content="Explore the reusable VS Code theme and every exported Bref component."
	/>
</svelte:head>

<Showcase />

<style>
	/* Keep the donor gallery reset local to this standalone preview. */
	:global(body:has([data-vscode-gallery])) {
		margin: 0;
	}

	:global(:where([data-vscode-gallery], [data-vscode-gallery] *)) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
</style>
