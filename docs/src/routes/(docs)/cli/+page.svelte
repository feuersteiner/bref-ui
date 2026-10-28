<script lang="ts">
	import { resolve } from '$app/paths';
	import PageContainer from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import { chapter, sections } from './sections.js';
</script>

<PageContainer
	title={chapter}
	description="Copy Bref components into your project and own their source."
>
	<Section {...sections[0]}>
		<p>Run from a project containing package.json, using Node.js:</p>
		<CodeSnippet
			language="bash"
			label="CLI commands"
			source={`npm install bref-ui
npx bref-ui init
npx bref-ui add button
npx bref-ui --help`}
		/>
		<p>
			<code>add button</code>
			automatically copies Icon and Theme dependencies.
			<code>add</code>
			previews planned files and requests approval before copying or overwriting.
		</p>
	</Section>
	<Section {...sections[1]}>
		<p>
			<code>#bref</code>
			imports local source you own;
			<code>#bref/*</code>
			maps its destination.
		</p>
		<p>
			<code>init</code>
			adds concrete package.json imports, defaulting to
			<code>src/lib/ui</code>
			or a
			<code>ui</code>
			directory inside the
			<code>#lib/*</code>
			target. Existing Bref imports are preserved; no separate configuration file is used.
		</p>
		<CodeSnippet
			language="json"
			label="Default package.json imports"
			source={`"imports": {
  "#bref": "./src/lib/ui/index.js",
  "#bref/*": "./src/lib/ui/*"
}`}
		/>
		<p>To choose a custom destination, edit both paths before running add:</p>
		<CodeSnippet
			language="json"
			label="Custom package.json imports"
			source={`"imports": {
  "#bref": "./src/components/ui/index.js",
  "#bref/*": "./src/components/ui/*"
}`}
		/>
	</Section>
	<Section {...sections[2]}>
		<p>Before the commands, in an existing Svelte project:</p>
		<CodeSnippet
			hideHeader
			language="text"
			label="Project tree before npm install and CLI commands"
			source={`my-app/
├── package.json
└── src/
    ├── lib/
    │   └── …
    └── routes/
        └── +page.svelte`}
		/>
		<p>After npm install, init and add button:</p>
		<CodeSnippet
			hideHeader
			language="text"
			label="Project tree after npm install, init and add button"
			source={`my-app/
├── package.json          # init adds #bref imports
├── package-lock.json     # npm install
├── node_modules/         # npm install
└── src/
    ├── lib/
    │   ├── …
    │   └── ui/           # add button
    │       ├── index.ts
    │       ├── button/
    │       │   └── button.svelte
    │       ├── icon/
    │       │   └── icon.svelte
    │       └── theme/
    │           ├── cli-theme.svelte
    │           ├── colors.svelte
    │           ├── surface.ts
    │           └── …
    └── routes/
        └── +page.svelte`}
		/>
		<p>
			<code>init</code>
			copies no files. The CLI writes
			<code>index.ts</code>
			; the
			<code>index.js</code>
			import mapping resolves to that source through TypeScript/Svelte tooling.
		</p>
	</Section>
	<Section {...sections[3]}>
		<p>Import the copied components through #bref; keep type imports from bref-ui/types.</p>
		<CodeSnippet
			label="Before: packaged components"
			source={`<script lang="ts">
  // 📦 Old way: packaged components
  import { Button, Theme } from 'bref-ui';
  import type { ButtonProps } from 'bref-ui/types';
<${'/'}script>`}
		/>
		<CodeSnippet
			label="After: copied components"
			source={`<script lang="ts">
  // ✅ Own the code: import copied components via #bref
  import { Button, Theme } from '#bref';
  import type { ButtonProps } from 'bref-ui/types';
<${'/'}script>

<Theme>
  <Button label="Save" />
</Theme>`}
		/>
		<p>Copying Theme makes its source available; render it once at the application root.</p>
	</Section>
	<Section {...sections[4]}>
		<p>
			The included Theme is default-only without a palette prop. Customize its CSS in
			<code>theme/colors.svelte</code>
			inside the copied directory. For the packaged Theme's palette prop and live controls, see
			<a href={resolve('library')}>Use the package</a>
			.
		</p>
	</Section>
</PageContainer>
