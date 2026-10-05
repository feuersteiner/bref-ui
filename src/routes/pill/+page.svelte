<script lang="ts">
	/* eslint-disable max-lines -- Keep the Pill gallery matrix and usage together. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Pill, TextInput, Select, Checkbox } from '$lib/index.js';
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
	let wide = $state(false);
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
			name: 'wide',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Fill the available width.'
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
				Text <TextInput bind:value={label} />
			</label>
			<div data-control>
				<label for="pill-size">Size</label>
				<Select
					id="pill-size"
					items={sizes.map((id) => ({ id, label: id }))}
					bind:value={() => size, (next) => (size = next as typeof size)}
				/>
			</div>
			<div data-control>
				<label for="pill-variant">Variant</label>
				<Select
					id="pill-variant"
					items={variants.map((id) => ({ id, label: id }))}
					bind:value={() => variant, (next) => (variant = next as typeof variant)}
				/>
			</div>
			<div data-control>
				<label for="pill-color">Color</label>
				<Select
					id="pill-color"
					items={colors.map((id) => ({ id, label: id }))}
					bind:value={() => color, (next) => (color = next as typeof color)}
				/>
			</div>
			<label>
				Wide <Checkbox bind:checked={wide} />
			</label>
		</div>
		<div data-demo="row">
			<Pill
				{label}
				{size}
				{variant}
				{color}
				{wide}
				icon={{ name: 'star' }}
				title="Native title attribute"
			>
				<strong>snippet</strong>
			</Pill>
			<Pill label="Clickable" onClick={() => clicked++} />
			<Pill label="Removable" {size} onDelete={() => removed++} />
			<Pill label="Combined" {size} onClick={() => clicked++} onDelete={() => removed++} />
			<Pill label="Animated" swoosh />
		</div>
		<p>Clicks: {clicked}; removals: {removed}</p>
		<Pill label="Full-width Pill" {size} {variant} {color} wide />
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
	[data-control] {
		display: grid;
		gap: 0.5rem;
		width: min(100%, 12rem);
		min-width: 0;
	}
</style>
