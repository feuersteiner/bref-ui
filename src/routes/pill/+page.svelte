<script lang="ts">
	/* eslint-disable max-lines -- Keep the Pill gallery matrix and usage together. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Pill } from '$lib/index.js';
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
	let clicked = $state(0);
	let removed = $state(0);
	const props = [
		{
			name: 'label',
			type: 'string',
			required: true,
			default: '—',
			description: 'Visible label.'
		},
		{
			name: 'icon',
			type: "Omit<IconProps, 'label' | 'size' | 'color'>",
			required: false,
			default: 'Omitted',
			description: 'Decorative leading icon.'
		},
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
			name: 'onClick',
			type: '(event: MouseEvent) => void',
			required: false,
			default: 'Omitted',
			description: 'Activate the Pill.'
		},
		{
			name: 'onDelete',
			type: '() => void',
			required: false,
			default: 'Omitted',
			description: 'Show a labeled remove button.'
		},
		{
			name: 'swoosh',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Animate the highlight.'
		}
	];
</script>

<Page title={chapter} description="A compact label for status, categories and optional actions.">
	<Section {...sections[0]}>
		<div data-demo="row">
			<Pill label="Draft" /><Pill label="Ready" color="success" variant="soft" /><Pill
				label="Featured"
				color="primary"
				variant="filled"
			/>
		</div>
		<CodeSnippet
			label="Pill usage code"
			source={`<script>\n  import { Pill } from 'bref-ui';\n<${'/'}script>\n\n<Pill label="Ready" color="success" variant="soft" />`}
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
			<Pill {label} {size} {variant} {color} icon={{ name: 'star' }} title="Native title attribute">
				<strong>snippet</strong>
			</Pill>
			<Pill label="Clickable" onClick={() => clicked++} />
			<Pill label="Removable" onDelete={() => removed++} />
			<Pill label="Combined" onClick={() => clicked++} onDelete={() => removed++} />
			<Pill label="Animated" swoosh />
		</div>
		<p>Clicks: {clicked}; removals: {removed}</p>
		{#each variants as variant (variant)}
			<fieldset>
				<legend>{variant}</legend>
				<div data-demo="row">
					{#each colors as color (color)}<Pill {variant} {color} label={color} />{/each}
				</div>
			</fieldset>
		{/each}
		<fieldset>
			<legend>Sizes and long content</legend>
			<div data-demo="row">
				{#each sizes as size (size)}<Pill {size} color="primary" label={size} />{/each}<Pill
					color="primary"
					label="A long category label that wraps on a narrow screen without losing its meaning"
				/>
			</div>
		</fieldset>
	</Section>
	<Section {...sections[2]}>
		<PropTable {props} label="Pill props" />
		<p>
			Pill accepts native div attributes and a children snippet. A clickable Pill supports Enter and
			Space; its remove button has a separate accessible name.
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
