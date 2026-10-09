<script lang="ts">
	import { Spinner } from '$lib/index.js';
	import type { Size } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';
	const usageCode = '<Spinner label="Loading results" />';
	const colorCode =
		'<span style="color: var(--color-primary)"><Spinner label="Loading results" /></span>';
	const sizes: Size[] = ['x-small', 'small', 'medium', 'large', 'x-large'];
	const colors = [
		'foreground',
		'primary',
		'secondary',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	] as const;
	const props = [
		{
			name: 'label',
			type: 'string',
			required: false,
			default: '—',
			description: 'Optional screen reader status text; omit for a decorative ring.'
		},
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'Inherited',
			description: 'Matches Icon sizes; omitted size inherits surrounding font size.'
		}
	];
</script>

<Page title={chapter} description="Show loading status or a decorative animated ring.">
	<Section {...sections[0]}>
		<Spinner label="Loading results" />
		<CodeSnippet label="Spinner usage code" source={usageCode} />
	</Section>
	<Section {...sections[1]}>
		<figure>
			<Spinner />
			<figcaption>Unlabeled, inherited size</figcaption>
		</figure>
		<div>
			{#each sizes as size (size)}<figure>
					<Spinner label={`Loading ${size}`} {size} />
					<figcaption>{size}</figcaption>
				</figure>{/each}
		</div>
	</Section>
	<Section {...sections[2]}>
		<div>
			{#each colors as color (color)}
				<figure style:color={`var(--color-${color})`}>
					<Spinner size="medium" label={`Loading ${color} results`} />
					<figcaption>{color}</figcaption>
				</figure>
			{/each}
		</div>
		<CodeSnippet label="Inherited spinner color code" source={colorCode} />
	</Section>
	<Section {...sections[3]}>
		<PropTable {props} />
		<p>
			The ring inherits the surrounding text color. A supplied label creates status text for
			assistive technology; an unlabeled ring is decorative. Reduced motion leaves a visible,
			stationary quarter-ring.
		</p>
	</Section>
</Page>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}
	figcaption {
		color: var(--color-foreground);
	}
	figure {
		display: grid;
		justify-items: center;
		gap: 0.5rem;
		min-width: 5rem;
		margin: 0;
	}
</style>
