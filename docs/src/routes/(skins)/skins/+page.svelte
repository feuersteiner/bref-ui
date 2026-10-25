<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, Pill, Surface } from 'bref-ui';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/syne';
	import Demos from './catalog/demos.svelte';
</script>

<svelte:head>
	<title>bref-ui/themes · Svelte themes & demos</title>
	<meta
		name="description"
		content="Try working apps built with bref/ui and palette data. Full component themes are developed separately."
	/>
</svelte:head>

<div data-showcase>
	<main id="showcase-content" tabindex="-1">
		<div data-intro>
			<p data-eyebrow>Made with Bref · Built with Svelte</p>
			<h1>App demos and<br />design system foundations.</h1>
			<p>Try working apps built with bref/ui and route-specific palettes.</p>
		</div>
		<section id="demos" aria-labelledby="demos-heading">
			<div data-section-heading>
				<h2 id="demos-heading">Demos</h2>
				<p>Working apps built with bref/ui.</p>
			</div>
			<Demos />
		</section>
		<section id="themes" aria-labelledby="themes-heading">
			<div data-section-heading>
				<h2 id="themes-heading">Themes</h2>
				<p>Preview palettes on existing bref/ui components.</p>
			</div>
			<div data-available>
				<p>Palette examples</p>
				<nav aria-label="Palette demonstrations">
					<Button
						href={resolve('/(skins)/skins/(themes)/themes/[theme]', { theme: 'relay' })}
						label="Relay palette"
						trailingIcon={{ name: 'arrow_outward' }}
						size="small"
					/>
					<Button
						href={resolve('/(skins)/skins/(themes)/themes/[theme]', { theme: 'forma' })}
						label="Forma palette"
						trailingIcon={{ name: 'arrow_outward' }}
						size="small"
					/>
					<Button
						href={resolve('/(skins)/skins/(themes)/themes/[theme]', { theme: 'elsewhere' })}
						label="Elsewhere palette"
						trailingIcon={{ name: 'arrow_outward' }}
						size="small"
					/>
				</nav>
			</div>
			<div data-wip-themes>
				{#each [{ name: 'VS Code', description: 'An editor-inspired theme.' }, { name: 'Liquid Glass', description: 'A theme with translucent surfaces.' }, { name: 'Minimalist Blocky', description: 'A theme with bold geometric shapes.' }] as theme (theme.name)}
					<article>
						<Surface variant="soft" radius="medium" spacing="large" height="fill">
							<div data-theme-heading>
								<h3>{theme.name}</h3>
								<Pill label="WIP" size="x-small" color="muted" variant="soft" />
							</div>
							<p>{theme.description}</p>
							<small>Planned · demonstration coming later</small>
						</Surface>
					</article>
				{/each}
			</div>
		</section>
	</main>
	<footer>
		<nav aria-label="Bref UI resources">
			<h2>Bref UI</h2>
			<a href="https://github.com/feuersteiner/bref-ui">GitHub</a>
			<a href={resolve('/(docs)')}>Documentation</a>
		</nav>
		<nav aria-label="Bref themes resources">
			<h2>Themes</h2>
			<a href="https://github.com/feuersteiner/bref-ui">GitHub</a>
			<a href="https://github.com/feuersteiner/bref-ui#readme">Documentation</a>
		</nav>
		<nav aria-label="Community">
			<h2>Community</h2>
			<a href="https://discord.gg/JpgQRTUsVS">Discord</a>
			<a href="https://x.com/feuersteinnnnn">Twitter / X</a>
		</nav>
	</footer>
</div>

<style>
	[data-showcase] {
		font:
			400 16px/24px 'Inter Variable',
			sans-serif;
		--showcase-rule: color-mix(in srgb, var(--color-foreground) 10%, transparent);
		width: min(1128px, calc(100% - 48px));
		margin: auto;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	main {
		scroll-margin-block-start: 180px;
	}
	[data-intro] {
		padding-block: 48px;
	}
	[data-eyebrow] {
		color: var(--color-muted);
		font-size: 14px;
	}
	h1,
	h2,
	h3 {
		font-family: 'Syne Variable', sans-serif;
	}
	h1 {
		font-size: clamp(36px, 5vw, 64px);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.045em;
		margin-block: 20px;
	}
	[data-intro] > p:last-child {
		max-width: 60ch;
		color: var(--color-muted);
		font-size: 18px;
		line-height: 1.5;
	}
	section {
		margin-bottom: 48px;
		padding-top: 24px;
		border-top: 1px solid color-mix(in srgb, var(--color-foreground) 6%, transparent);
		scroll-margin-top: 180px;
	}
	[data-section-heading] {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 24px;
	}
	h2 {
		font-size: clamp(28px, 3vw, 36px);
		font-weight: 400;
		line-height: 1.2;
		letter-spacing: -0.025em;
	}
	[data-section-heading] p {
		font-size: 13px;
		color: var(--color-muted);
	}
	[data-available] {
		border-block: 1px solid var(--showcase-rule);
		padding-block: 18px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
	}
	[data-available] p {
		font-size: 13px;
		color: var(--color-primary);
		font-weight: 600;
	}
	[data-wip-themes] {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	[data-theme-heading] {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	h3 {
		flex: 1;
		min-width: 0;
		font-size: 24px;
		font-weight: 400;
	}
	article p {
		font-size: 13px;
		line-height: 1.6;
		color: var(--color-muted);
	}
	small {
		font-size: 11px;
		color: var(--color-muted);
	}
	footer {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
		border-top: 1px solid var(--showcase-rule);
		padding-block: 32px;
		font-size: 13px;
		color: var(--color-muted);
	}
	footer nav {
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}
	footer h2 {
		font:
			600 14px / 24px 'Inter Variable',
			sans-serif;
		color: var(--color-foreground);
		letter-spacing: normal;
	}
	footer a:hover {
		color: var(--color-primary);
		text-decoration: underline;
	}
	@media (max-width: 780px) {
		[data-intro] {
			padding-block: 24px;
		}
		[data-section-heading] {
			align-items: flex-start;
			flex-direction: column;
			gap: 8px;
		}
		[data-wip-themes] {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 400px) {
		footer {
			grid-template-columns: 1fr;
		}
	}
</style>
