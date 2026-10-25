<script lang="ts">
	import { resolve } from '$app/paths';
	import PageContainer from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import { chapter, sections } from './sections.js';
</script>

<PageContainer
	title={chapter}
	description="Reusable component themes are being prepared for the themes package."
>
	<Section {...sections[0]}>
		<p>
			Full themes own their component styling and have individual package entry points. They will be
			added through separate pull requests after the workspace migration.
		</p>
		<p>
			The <a href={resolve('/(skins)/skins')}>skins</a>
			are complete application demos using canonical Bref components and palette configuration.
		</p>
	</Section>
</PageContainer>
