<script lang="ts">
	import { resolve } from '$app/paths';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import { chapter, sections } from './sections.js';
</script>

<Page
	title={chapter}
	description="Give agents the component reference through targeted CLI commands or a single /llms.txt document."
>
	<Section {...sections[0]}>
		<p>
			Available from Bref-ui 3.1.0, CLI documentation lets agents discover components and read only
			the reference needed to build with them. Install the package, then query its bundled docs:
		</p>
		<CodeSnippet
			language="bash"
			label="Discover and read component references"
			source={`npm install bref-ui@^3.1.0
npx bref-ui docs list
npx bref-ui docs cli
npx bref-ui docs button
npx bref-ui docs button usage
npx bref-ui docs button props
npx bref-ui docs button cli`}
		/>
		<p>
			<code>docs list</code>
			identifies public components and whether their source can be copied.
			<code>docs cli</code>
			explains installation, initialization and source ownership. A component command returns its full
			reference by default; add
			<code>usage</code>
			,
			<code>props</code>
			or
			<code>cli</code>
			to select examples and guidance, prop definitions or installation details. Dependency documentation
			is never expanded automatically.
		</p>
		<p>
			Every response identifies the installed package version. Documentation reads require no
			<code>init</code>
			, prompts or project files and work offline once the package is available. The package manager may
			need the network for the initial installation. For the source-copy workflow, see
			<a href={resolve('cli')}>Own the code</a>
			.
		</p>
	</Section>
	<Section {...sections[1]}>
		<p>
			Give an agent the <a href={resolve('llms.txt')}>/llms.txt reference</a>
			when it needs the full component collection in one text document. It includes descriptions, copyable
			examples, behavior guidance and props for every public component, including package-only components.
		</p>
		<p>
			The CLI, this website and <code>/llms.txt</code>
			share the same typed component references. Use the CLI for focused reads matching the installed
			package version; use
			<code>/llms.txt</code>
			for the full reference published with this site.
		</p>
	</Section>
</Page>
