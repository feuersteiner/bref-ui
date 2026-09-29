<script lang="ts">
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Pill } from '$lib/index.js';
	import PillGroupDemo from './pill-group-demo.svelte';
	import PillChoiceGroupDemo from './pill-choice-group-demo.svelte';
	import type { Color, Size, Variant } from '$lib/types.js';

	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const variants = ['neutral', 'soft', 'filled'] as const;
	const colors = [
		'primary',
		'secondary',
		'foreground',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	] as const;
	let size = $state<Size>('medium');
	let variant = $state<Variant>('neutral');
	let color = $state<Exclude<Color, 'background'>>('foreground');
	let label = $state('Status');
	let ref = $state<HTMLSpanElement>();
	const props = [
		{
			name: 'children',
			type: 'Snippet',
			required: false,
			default: 'Omitted',
			description: 'Visible content.'
		},
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'Five sizes from x-small to x-large.'
		},
		{
			name: 'variant',
			type: 'Variant',
			required: false,
			default: 'neutral',
			description: 'neutral, soft or filled.'
		},
		{
			name: 'color',
			type: "Exclude<Color, 'background'>",
			required: false,
			default: 'foreground',
			description: 'Theme role.'
		},
		{
			name: 'ref',
			type: 'HTMLSpanElement',
			required: false,
			default: 'Omitted',
			description: 'Bind to the native span.'
		}
	];
</script>

<Page title={chapter} description="A passive label for short status or category text.">
	<Section {...sections[0]}>
		<div data-demo="row">
			<Pill>Draft</Pill><Pill color="success" variant="soft">Ready</Pill><Pill
				color="primary"
				variant="filled"
			>
				Featured
			</Pill>
		</div>
		<CodeSnippet
			label="Pill usage code"
			source={`<script>\n  import { Pill } from 'bref-ui';\n<${'/'}script>\n\n<Pill color="success" variant="soft">Ready</Pill>`}
		/>
	</Section>
	<Section {...sections[1]}>
		<div data-demo="controls">
			<label>
				Text <input bind:value={label} />
			</label>
			<label>
				Size <select bind:value={size}>
					{#each sizes as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				Variant <select bind:value={variant}>
					{#each variants as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				Color <select bind:value={color}>
					{#each colors as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
		</div>
		<div data-demo="row">
			<Pill {size} {variant} {color} bind:ref title="Native title attribute">{label}</Pill>
		</div>
		<p>Bound element: {ref?.tagName ?? 'pending'}</p>
		{#each variants as variant (variant)}
			<fieldset>
				<legend>{variant}</legend>
				<div data-demo="row">
					{#each colors as color (color)}<Pill {variant} {color}>{color}</Pill>{/each}
				</div>
			</fieldset>
		{/each}
		<fieldset>
			<legend>Sizes and long content</legend>
			<div data-demo="row">
				{#each sizes as size (size)}<Pill {size} color="primary">{size}</Pill>{/each}<Pill
					color="primary"
				>
					A long category label that wraps on a narrow screen without losing its meaning
				</Pill>
			</div>
		</fieldset>
	</Section>
	<Section {...sections[2]}>
		<PillGroupDemo {size} {variant} {color} />
		<PillChoiceGroupDemo />
		<PropTable {props} />
		<p>
			Pill renders an inert span. Native span attributes pass through; <code>bind:ref</code>
			exposes the element. Content is a children snippet. Compose actions or removal with separate controls.
		</p>
	</Section>
</Page>

<style>
	[data-demo='row'],
	[data-demo='controls'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
	}
	[data-demo='controls'] > label {
		display: grid;
		gap: 8px;
	}
	fieldset {
		min-width: 0;
		margin-block: 24px;
		padding: 24px;
		border: 1px solid var(--docs-rule);
	}
	legend {
		padding-inline: 8px;
	}
</style>
