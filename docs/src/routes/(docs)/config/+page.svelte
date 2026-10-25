<script lang="ts">
	import { resolve } from '$app/paths';
	import PageContainer from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import { chapter, sections } from './sections.js';
</script>

<PageContainer
	title={chapter}
	description="Install Bref through npm and configure editable component copies with package imports."
>
	<Section {...sections[0]}>
		<p>
			Install the package, then run the optional copy CLI from the project directory with Node.js.
		</p>
		<pre aria-label="npm installation commands"><code>{`npm install bref-ui
npx bref-ui init
npx bref-ui add button`}</code></pre>
		<p>
			Import packaged components from <code>bref-ui</code>
			, or import editable copies from
			<code>#bref</code>
			. Both use
			<code>bref-ui/types</code>
			.
		</p>
	</Section>
	<Section {...sections[1]}>
		<p>
			<code>init</code>
			adds concrete paths to
			<code>package.json</code>
			. The destination follows
			<code>#lib/*</code>
			, or defaults to
			<code>src/lib/ui</code>
			.
		</p>
		<pre aria-label="package.json imports"><code>{`"imports": {
  "#bref": "./src/lib/ui/index.js",
  "#bref/*": "./src/lib/ui/*"
}`}</code></pre>
		<p>
			Edit these paths to choose another destination. Existing Bref imports are preserved. <code>
				add
			</code>
			 previews every change and requests approval before overwriting a file.
		</p>
	</Section>
	<Section {...sections[2]}>
		<p>
			Use the <a href={resolve('/(docs)/theme')}>Theme documentation</a>
			 to configure the palette and shared light, dark or system mode. Fonts and icon assets remain opt-in.
		</p>
	</Section>
</PageContainer>

<style>
	pre {
		max-width: 100%;
		overflow: auto;
		padding: 24px;
		background: var(--docs-code-background);
		border-radius: 12px;
	}
</style>
