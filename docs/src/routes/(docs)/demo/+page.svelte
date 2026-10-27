<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { Icon, Surface } from 'bref-ui';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import ThemePreview from '../theme/theme-preview.svelte';
	import { demoPages, palettePages } from './catalog.js';
	import { palettes } from './palettes.js';
	import { chapter, sections } from './sections.js';
</script>

<Page
	title={chapter}
	description="Explore complete apps and try their palettes with Bref components."
>
	<Section {...sections[0]}>
		<div data-demos>
			{#each demoPages as demo (demo.href)}
				<a href={resolve(demo.href)} target="_blank" rel="noopener">
					<Surface variant="soft" radius="medium" spacing="medium" hover="medium" height="fill">
						<img
							src={asset(demo.cover.src)}
							alt={demo.cover.alt}
							width={demo.cover.width}
							height={demo.cover.height}
							loading="lazy"
							decoding="async"
						/>
						<h3><Icon name={demo.icon} /> {demo.title}</h3>
						<p>{demo.description}</p>
						<span>Explore demo → (opens in new tab)</span>
					</Surface>
				</a>
			{/each}
		</div>
	</Section>
	<Section {...sections[1]}>
		<div data-palettes>
			{#each palettePages as palette (palette.href)}
				<article>
					<h3>{palette.title}</h3>
					<ThemePreview palette={palettes[palette.palette]} />
					<a href={resolve(palette.href)}>Explore {palette.title} →</a>
				</article>
			{/each}
		</div>
	</Section>
</Page>

<style>
	[data-demos] {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
		gap: 24px;
	}
	[data-demos] a {
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}
	[data-demos] img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 11/5;
		object-fit: cover;
		object-position: center bottom;
	}
	[data-palettes] {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
		gap: 24px;
	}
	[data-palettes] article {
		display: grid;
		align-content: start;
		gap: 16px;
		min-width: 0;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	h3 {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	p {
		color: var(--color-muted);
	}
	span,
	[data-palettes] a {
		color: var(--color-primary);
	}
</style>
