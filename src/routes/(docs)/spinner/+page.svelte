<script lang="ts">
	import { Spinner, Select, Checkbox, TextInput } from '$lib/index.js';
	import type { Size } from '$lib/types.js';

	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
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
	const previewSizes = ['inherit', ...sizes] as const;
	let previewSize = $state<(typeof previewSizes)[number]>('medium');
	let previewLabel = $state('Loading results');
	let announced = $state(true);
	let color = $state<(typeof colors)[number]>('primary');
	const playgroundSource = $derived(`<script>
  import { Spinner } from 'bref-ui';
<${'/'}script>

<span style="color: var(--color-${color}); font-size: 2rem"><Spinner${previewSize === 'inherit' ? '' : ' size=' + JSON.stringify(previewSize)}${announced ? ' label={' + JSON.stringify(previewLabel) + '}' : ''} /></span>`);
	const resetPlayground = () => {
		previewSize = 'medium';
		previewLabel = 'Loading results';
		announced = true;
		color = 'primary';
	};
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
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<Spinner label="Loading results" />
		<CodeSnippet label="Spinner usage code" source={usageCode} />
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={resetPlayground}>
			{#snippet preview()}<span data-demo="preview" style:color={`var(--color-${color})`}>
					<Spinner
						size={previewSize === 'inherit' ? undefined : previewSize}
						label={announced ? previewLabel : undefined}
					/>
				</span>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="spinner-previewSize" label="Size">
					<Select
						id="spinner-previewSize"
						items={previewSizes.map((id) => ({ id, label: id }))}
						bind:value={() => previewSize, (next) => (previewSize = next as typeof previewSize)}
					/>
				</PlaygroundField><PlaygroundField id="spinner-color" label="Inherited color">
					<Select
						id="spinner-color"
						items={colors.map((id) => ({ id, label: id }))}
						bind:value={() => color, (next) => (color = next as typeof color)}
					/>
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Accessibility">
				<PlaygroundField id="spinner-announced" label="Announce loading status" toggle>
					<Checkbox id="spinner-announced" bind:checked={announced} />
				</PlaygroundField><PlaygroundField id="spinner-previewLabel" label="Status label">
					<TextInput id="spinner-previewLabel" bind:value={previewLabel} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'sizes')!}>
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
	<Section {...sections.find((section) => section.id === 'colors')!}>
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
	<Section {...sections.find((section) => section.id === 'props')!}>
		<PropTable {props} />
		<p>
			The ring inherits the surrounding text color. A supplied label creates status text for
			assistive technology; an unlabeled ring is decorative. Reduced motion leaves a visible,
			stationary quarter-ring.
		</p>
	</Section>
</Page>

<style>
	[data-demo='preview'] {
		display: grid;
		justify-items: center;
		font-size: 2rem;
	}
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
