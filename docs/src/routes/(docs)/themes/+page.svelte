<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { Surface } from 'bref-ui';
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
		<CodeSnippet
			language="bash"
			label="Install themes"
			source="npm install bref-ui bref-ui-themes"
		/>
		<p>
			Bref-ui 3 and Svelte 5 are peer dependencies. Shared types come from
			<code>bref-ui/types</code>
			and are re-exported as types from
			<code>bref-ui-themes</code>
			. The custom text font remains optional.
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
		<a data-theme-card href={resolve('themes/new-paris')} target="_blank" rel="noopener noreferrer">
			<Surface variant="soft" radius="medium" spacing="medium" hover="medium">
				<div data-theme-preview>
					<img
						src={asset('previews/theme-new-paris.jpg')}
						alt="New Paris gallery with serif typography, an ivory panel and a black collection button"
						width="1264"
						height="652"
						loading="lazy"
						decoding="async"
					/>
					<div data-theme-description>
						<h3>New Paris</h3>
						<p>Black and ivory controls, serif typography and opaque paper overlays.</p>
						<span>Open gallery → (opens in new tab)</span>
					</div>
				</div>
			</Surface>
		</a>
		<p>
			New Paris loads Material Symbols icons automatically with Theme. Its custom text font is
			optional to avoid adding unused font assets to apps; text falls back to system fonts. To match
			the gallery typography, install and import
			<a href="https://www.npmjs.com/package/@fontsource-variable/inter">Inter</a>
			:
		</p>
		<CodeSnippet
			language="bash"
			label="Install optional New Paris font"
			source="npm install @fontsource-variable/inter"
		/>
		<CodeSnippet
			label="New Paris with optional font"
			source={`<script>
  import '@fontsource-variable/inter/index.css';
  import { Theme, Button } from 'bref-ui-themes/new-paris';
<${'/'}script>

<Theme><Button label="Save" icon={{ name: 'check' }} /></Theme>`}
		/>
		<p>
			<code>bref-ui-themes/new-paris</code>
		</p>
	</Section>
	<Section {...sections[2]}>
		<a data-theme-card href={resolve('themes/glassy')} target="_blank" rel="noopener noreferrer">
			<Surface variant="soft" radius="medium" spacing="medium" hover="medium">
				<div data-theme-preview>
					<img
						src={asset('previews/theme-glassy.jpg')}
						alt="Glassy gallery with translucent controls and frosted panels over a soft gradient"
						width="1264"
						height="652"
						loading="lazy"
						decoding="async"
					/>
					<div data-theme-description>
						<h3>Glassy</h3>
						<p>Translucent controls, frosted overlays and soft gradient backgrounds.</p>
						<span>Open gallery → (opens in new tab)</span>
					</div>
				</div>
			</Surface>
		</a>
		<p>
			Theme loads Material Symbols automatically. Inter stays opt-in to avoid unused font assets:
		</p>
		<CodeSnippet
			language="bash"
			label="Install optional Glassy font"
			source="npm install @fontsource-variable/inter"
		/>
		<CodeSnippet
			label="Glassy with optional font"
			source={`<script>
  import '@fontsource-variable/inter/index.css';
  import { Theme, Button } from 'bref-ui-themes/glassy';
<${'/'}script>

<Theme><Button label="Save" icon={{ name: 'check' }} /></Theme>`}
		/>
	</Section>
	<Section {...sections[3]}>
		<a
			data-theme-card
			href={resolve('themes/crystal-code')}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Surface variant="soft" radius="medium" spacing="medium" hover="medium">
				<div data-theme-preview>
					<img
						src={asset('previews/theme-crystal-code.jpg')}
						alt="Crystal Code gallery with a dark editor workbench, code tabs and a live component preview"
						width="1264"
						height="652"
						loading="lazy"
						decoding="async"
					/>
					<div data-theme-description>
						<h3>Crystal Code</h3>
						<p>Light and dark frosted workbench controls with compact editor styling.</p>
						<span>Open gallery → (opens in new tab)</span>
					</div>
				</div>
			</Surface>
		</a>
		<p>
			Theme loads Material Symbols automatically. Inter stays opt-in to avoid unused font assets:
		</p>
		<CodeSnippet
			language="bash"
			label="Install optional Crystal Code font"
			source="npm install @fontsource-variable/inter"
		/>
		<CodeSnippet
			label="Crystal Code with optional font"
			source={`<script>
  import '@fontsource-variable/inter/index.css';
  import { Theme, Button } from 'bref-ui-themes/crystal-code';
<${'/'}script>

<Theme><Button label="Save" icon={{ name: 'check' }} /></Theme>`}
		/>
	</Section>
</PageContainer>

<style>
	[data-theme-card] {
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}
	[data-theme-card]:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	[data-theme-preview] {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
		align-items: center;
		gap: 24px;
	}
	img {
		display: block;
		width: 100%;
		height: auto;
	}
	[data-theme-description] {
		display: grid;
		gap: 16px;
	}
	[data-theme-description] p {
		color: var(--color-muted);
	}
	[data-theme-description] span {
		color: var(--color-primary);
	}
</style>
