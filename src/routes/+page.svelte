<script lang="ts">
	import { chapter, sections } from './sections.js';
	import { resolve } from '$app/paths';
	import Page from './components/page.svelte';
	import Section from './components/section.svelte';
	import CodeSnippet from './components/code-snippet.svelte';

	const usage = `<script lang="ts">
  import { Button, Theme } from 'bref';
\x3c/script>

<Theme>
  <Button label="Save" />
</Theme>`;
</script>

<Page title={chapter} description="Svelte components with scoped styles and simple composition.">
	<Section {...sections[0]}>
		<CodeSnippet source={usage} />
	</Section>
	<Section {...sections[1]}>
		<p>
			Import components from <code>bref</code>. Add <code>Theme</code> around the application to opt into
			its colors, reset and Material Symbols font.
		</p>
		<p>These pages document the currently implemented APIs.</p>
		<ul>
			<li><a href={resolve('/button')}>Button</a> — actions, sizes, variants and icons.</li>
			<li><a href={resolve('/icon')}>Icon</a> — Material Symbols and accessible names.</li>
			<li><a href={resolve('/theme')}>Theme</a> — palette, modes and customization.</li>
		</ul>
	</Section>
</Page>
