<script lang="ts">
	import { chapter, sections } from './sections.js';
	import { resolve } from '$app/paths';
	import Page from './components/page-container.svelte';
	import Section from './components/section.svelte';
	import CodeSnippet from './components/code-snippet.svelte';
	import { Button, Icon, Progress, Surface, Switch } from '$lib/index.js';
	import MovingBackground from './components/moving-background.svelte';

	let count = $state(0);
	let notifications = $state(true);

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
	<p>Basically, open source IS the future: it gives you ultimate customizability.</p>
	<Section {...sections[0]}>
		<div data-demo="hero">
			<MovingBackground />
			<Surface class="glass" spacing="medium" radius="medium" variant="soft">
				<p data-eyebrow><Icon name="auto_awesome" /> Made to become your own</p>
				<h3>A little less noise.</h3>
				<p>Small components. A clear point of view. Room for yours.</p>
				<div data-demo="actions">
					<Button
						label={`Count: ${count}`}
						icon={{ name: 'add' }}
						color="primary"
						variant="soft"
						onClick={() => count++}
					/>
					<Button
						label="Explore Button"
						href={resolve('/button')}
						trailingIcon={{ name: 'arrow_forward' }}
					/>
				</div>
				<label>
					<Switch bind:checked={notifications} /> Notifications {notifications ? 'on' : 'off'}
				</label>
				<Progress value={0.65} label="Example progress" />
			</Surface>
		</div>
		<CodeSnippet source={usage} label="Bref usage code" />
		<p>Render Theme once at the app root for its palette, reset and Material Symbols font setup.</p>
	</Section>
	<Section {...sections[1]}>
		<p>
			The need for quality code curation isn't going away. Bref brings that curation and quality
			management together with the flexibility to adapt every component to your needs. That's the
			deal.
		</p>
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

<style>
	[data-demo='hero'] {
		position: relative;
		isolation: isolate;
		padding: clamp(20px, 4vw, 40px);
		border-radius: 1.5rem;
		overflow: hidden;
	}
	[data-demo='hero'] > :global([data-surface]) {
		position: relative;
		z-index: 1;
		gap: 20px;
		max-width: 32rem;
		margin-inline: auto;
		padding: clamp(20px, 3vw, 32px);
	}
	[data-eyebrow] {
		display: flex;
		align-items: center;
		gap: 8px;
		color: color-mix(in srgb, var(--color-muted) 80%, var(--color-foreground));
		font-size: 0.875rem;
	}
	h3 {
		font-size: clamp(24px, 3vw, 32px);
		letter-spacing: -0.025em;
	}
	[data-demo='actions'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	label {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 44px;
	}
	[data-demo='hero'] p {
		line-height: 1.5;
	}
</style>
