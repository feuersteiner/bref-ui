<script lang="ts">
	import { resolve } from '$app/paths';
	import PageContainer from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import { chapter, sections } from './sections.js';
</script>

<PageContainer
	title={chapter}
	description="Work in progress: predefined themes will be available through the themes package."
>
	<Section {...sections[0]}>
		<p>
			Predefined themes, such as a VS Code theme, are planned for later pull requests. They will
			provide reusable component styling through individual package entry points; import
			instructions will be documented when those themes are available.
		</p>
		<p>
			<a href={resolve('demo')}>Demo</a>
			shows complete applications using canonical Bref components and palette configuration.
		</p>
	</Section>
</PageContainer>
