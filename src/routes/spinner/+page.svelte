<script lang="ts">
	import { Spinner } from '$lib/index.js';
	import type { Color, Size } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';
	const usageCode = '<Spinner label="Loading results" />';
	const sizes: Size[] = ['x-small', 'small', 'medium', 'large', 'x-large'];
	const colors: Color[] = [
		'primary',
		'secondary',
		'foreground',
		'background',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	];
	const props = [
		{
			name: 'label',
			type: 'string',
			required: true,
			default: '—',
			description: 'Screen reader status text.'
		},
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'x-small through x-large.'
		},
		{
			name: 'color',
			type: 'Color',
			required: false,
			default: 'primary',
			description: 'Theme color for the ring.'
		},
		{
			name: 'ref',
			type: 'HTMLSpanElement',
			required: false,
			default: 'null',
			description: 'Bindable native span reference.'
		}
	];
</script>

<Page title={chapter} description="Show a labeled loading status with an animated ring.">
	<Section {...sections[0]}>
		<Spinner label="Loading results" />
		<CodeSnippet label="Spinner usage code" source={usageCode} />
	</Section>
	<Section {...sections[1]}>
		<div>
			{#each sizes as size (size)}<figure>
					<Spinner label={`Loading ${size}`} {size} />
					<figcaption>{size}</figcaption>
				</figure>{/each}
		</div>
		<div>
			{#each colors as color (color)}<figure>
					<Spinner label={`Loading ${color}`} {color} />
					<figcaption>{color}</figcaption>
				</figure>{/each}
		</div>
	</Section>
	<Section {...sections[2]}>
		<PropTable {props} />
		<p>
			Native span attributes and a bindable ref are supported. The visible ring is decorative; the
			label is status text for assistive technology. Animation stops under reduced motion.
		</p>
	</Section>
</Page>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}
	figure {
		display: grid;
		justify-items: center;
		gap: 0.5rem;
		min-width: 5rem;
		margin: 0;
	}
</style>
