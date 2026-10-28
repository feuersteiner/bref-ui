<script lang="ts">
	import '@fontsource-variable/inter/index.css';
	import NewParisShowcase from './showcase.svelte';
</script>

<svelte:head>
	<title>New Paris theme | Bref</title>
	<meta
		name="description"
		content="New Paris: twenty theme-owned Bref components in black and ivory, with scoped styles and native interactions."
	/>
</svelte:head>

<NewParisShowcase />

<style>
	/* Keep the donor gallery reset local to this standalone preview. */
	:global(body:has([data-new-paris-showcase])) {
		margin: 0;
	}

	:global(:where([data-new-paris-showcase], [data-new-paris-showcase] *)) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
</style>
