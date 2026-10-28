<script lang="ts">
	import '@fontsource-variable/inter/index.css';
	import Showcase from './showcase.svelte';
</script>

<svelte:head>
	<title>Crystal Code theme | Bref</title>
	<meta
		name="description"
		content="Explore the reusable Crystal Code theme and every exported Bref component."
	/>
</svelte:head>

<Showcase />

<style>
	/* Keep the donor gallery reset local to this standalone preview. */
	:global(body:has([data-crystal-code-gallery])) {
		margin: 0;
	}

	:global(:where([data-crystal-code-gallery], [data-crystal-code-gallery] *)) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
</style>
