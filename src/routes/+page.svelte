<script lang="ts">
	import { chapter, sections } from './sections.js';
	import { resolve } from '$app/paths';
	import Page from './components/page-container.svelte';
	import Section from './components/section.svelte';
	import CodeSnippet from './components/code-snippet.svelte';

	const usage = `<script lang="ts">
  import { Button, Theme } from 'bref-ui';
  let count = $state(0);
\x3c/script>

<Theme />
<Button label={\`Count: \${count}\`} onClick={() => count++} />`;
</script>

<Page
	title={chapter}
	description="A Svelte-first, human-first, agent-first UI library for building beautiful sites and apps with components you can make your own."
>
	<Section {...sections[0]}>
		<CodeSnippet source={usage} label="Bref usage code" />
		<p>Render Theme once at the app root for its palette, reset and Material Symbols font setup.</p>
		<p>Import bref-ui/theme.css for palette CSS without fonts or a reset.</p>
	</Section>
	<Section {...sections[1]}>
		<h3>Svelte-first</h3>
		<p>
			Build with small components, scoped CSS and familiar HTML. The goal is to keep runtime
			dependencies to Svelte; the current package also includes the Material Symbols font.
			Components preserve native events, bindings and snippets.
		</p>
		<h3>Human-first</h3>
		<p>
			Compose components and make them your own. The source ownership model is inspired by shadcn;
			tooling to copy source into a project is in development.
		</p>
		<h3>Agent-first</h3>
		<p>
			Bref is planned to pair its component collection with tools for discovery, customization and
			validation. Site generation and live generative UI remain future work.
		</p>
	</Section>
	<Section {...sections[2]}>
		<p>These pages document the current Button, Icon and Theme APIs.</p>
		<ul>
			<li><a href={resolve('/button')}>Button: actions, sizes, variants and icons</a></li>
			<li><a href={resolve('/icon')}>Icon: Material Symbols and accessible names</a></li>
			<li><a href={resolve('/surface')}>Surface: semantic containers, layout and treatments</a></li>
			<li><a href={resolve('/theme')}>Theme: palette, modes and customization</a></li>
		</ul>
		<p>ThemeModeToggle is also available from the package exports.</p>
	</Section>
</Page>
