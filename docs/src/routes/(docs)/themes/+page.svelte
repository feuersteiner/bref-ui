<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from 'bref-ui';
	import PageContainer from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
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
			Install <a href="https://www.npmjs.com/package/bref-ui-themes">bref-ui-themes on npm</a>
			in a Svelte 5 app, then import components from the theme's entry point:
		</p>
		<CodeSnippet language="bash" label="Install themes" source="npm install bref-ui-themes" />
		<p>
			Svelte 5 is the only peer dependency. No Bref-ui installation is needed, and fonts remain
			optional.
		</p>
		<CodeSnippet
			label="Use New Paris"
			source={`<script>
  import { Theme, Button } from 'bref-ui-themes/new-paris';
<${'/'}script>

<Theme><Button label="Save" /></Theme>`}
		/>
		<p>
			<a href={resolve('demo')}>Demo</a>
			shows complete applications using canonical Bref components and palette configuration.
		</p>
	</Section>
	<Section {...sections[1]}>
		<p>Black and ivory controls, serif typography and opaque paper overlays.</p>
		<p>
			Fonts are opt-in to avoid bloating the package and apps with unused fonts. New Paris adds no
			font dependencies or automatic font imports. Text falls back to system fonts; to match the
			gallery typography and render icons, install and import
			<a href="https://www.npmjs.com/package/@fontsource-variable/inter">Inter</a>
			and
			<a href="https://www.npmjs.com/package/@fontsource-variable/material-symbols-outlined">
				Material Symbols
			</a>
			directly:
		</p>
		<CodeSnippet
			language="bash"
			label="Install optional New Paris fonts"
			source="npm install @fontsource-variable/inter @fontsource-variable/material-symbols-outlined"
		/>
		<CodeSnippet
			label="New Paris with optional fonts"
			source={`<script>
  import '@fontsource-variable/inter/index.css';
  import '@fontsource-variable/material-symbols-outlined/fill.css';
  import { Theme, Button } from 'bref-ui-themes/new-paris';
<${'/'}script>

<Theme><Button label="Save" icon={{ name: 'check' }} /></Theme>`}
		/>
		<p>
			<code>bref-ui-themes/new-paris</code>
		</p>
		<div>
			<Button
				href={resolve('themes/new-paris')}
				target="_blank"
				rel="noopener noreferrer"
				label="Open New Paris gallery"
				variant="filled"
				color="primary"
				size="x-large"
			/>
		</div>
	</Section>
</PageContainer>

<style>
	div {
		padding-block: 8px 24px;
	}
</style>
