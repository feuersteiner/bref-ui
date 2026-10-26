<script lang="ts">
	import { resolve } from '$app/paths';
	import PageContainer from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import { chapter, sections } from './sections.js';
</script>

<PageContainer
	title={chapter}
	description="Reusable component themes with individual package entry points and interactive galleries."
>
	<Section {...sections[0]}>
		<p>
			Full themes own their component styling and have individual package entry points. Each gallery
			below imports its theme through the matching public package entry point.
		</p>
		<p>
			The <a href={resolve('/(skins)/skins')}>skins</a>
			are complete application demos using canonical Bref components and palette configuration.
		</p>
	</Section>
	<Section {...sections[1]}>
		<p>Black and ivory controls, serif typography and opaque paper overlays.</p>
		<p>
			<a href={resolve('/(themes)/themes/new-paris')}>Open New Paris gallery</a>
			·
			<code>bref-ui-themes/new-paris</code>
		</p>
	</Section>
	<Section {...sections[2]}>
		<p>Translucent controls and frosted overlays with scoped component styling.</p>
		<p>
			<a href={resolve('/(themes)/themes/glassy')}>Open Glassy gallery</a>
			·
			<code>bref-ui-themes/glassy</code>
		</p>
	</Section>
</PageContainer>
