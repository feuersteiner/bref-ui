<script lang="ts">
	import '@fontsource-variable/inter/index.css';
	import GlassyShowcase from './showcase.svelte';
</script>

<svelte:head>
	<title>Glassy · Liquid Glass theme | Bref</title>
	<meta
		name="description"
		content="The Glassy component collection: translucent surfaces, crisp controls and native interactions for Svelte."
	/>
</svelte:head>

<GlassyShowcase />

<style>
	/* Keep the donor gallery reset local to this standalone preview. */
	:global(body:has([data-glassy-gallery])) {
		margin: 0;
	}

	:global(:where([data-glassy-gallery], [data-glassy-gallery] *)) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
</style>
