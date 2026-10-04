<script lang="ts">
	/* eslint-disable max-lines -- Keep the Surface matrix and interactive examples in their documentation page. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Surface, Button, Icon, TextInput, PillGroup, Progress, Spinner } from '$lib/index.js';
	import type { Color, Size, SurfaceProps, SurfaceRadius, Variant } from '$lib/types.js';

	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const variants = ['neutral', 'soft', 'filled'] as const;
	const colors: Color[] = [
		'background',
		'foreground',
		'primary',
		'secondary',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	];
	const radii: SurfaceRadius[] = [...sizes, '0rem', '2rem', '50%'];
	let as = $state<SurfaceProps['as']>('div');
	let variant = $state<Variant>('soft');
	let tint = $state<Color>('background');
	let spacing = $state<Size | undefined>('medium');
	let orientation = $state<SurfaceProps['orientation']>('vertical');
	let width = $state<SurfaceProps['width']>('fill');
	let height = $state<SurfaceProps['height']>('fit');
	let radius = $state<SurfaceRadius | undefined>('small');
	let shadow = $state(false);
	let hover = $state<SurfaceProps['hover']>();
	let scroll = $state(false);
	let hidden = $state(false);
	let clicks = $state(0);
	let focused = $state(0);
	const items = [
		{ id: 'one', label: 'Design' },
		{ id: 'two', label: 'Development' }
	];
	const source = `<script>
  import { Surface } from 'bref-ui';
<${'/'}script>

<Surface as="section" variant="soft" spacing="medium" radius="small" aria-label="Details">
  <h2>Details</h2>
  <p>Content inside the surface.</p>
</Surface>`;
	const props = [
		['as', "'div' | 'section' | 'span'", 'div', 'Native root element.'],
		['children', 'Snippet', 'Omitted', 'Content rendered directly inside the root.'],
		['tint', 'Color', 'background', 'Theme tint; text color inherits.'],
		['variant', 'Variant', 'neutral', 'Transparent neutral, frosted soft, or opaque filled panel.'],
		['spacing', 'Size', 'Omitted', 'Shared padding and gap; omitted means zero.'],
		[
			'orientation',
			'Orientation',
			'vertical',
			'Column, or row with centered cross-axis alignment.'
		],
		['width', 'Dimension', 'fill', 'fill uses 100%; fit hugs content.'],
		['height', 'Dimension', 'fit', 'fit uses natural height; fill uses 100% of a sized parent.'],
		[
			'radius',
			'Size | `${number}rem` | `${number}%`',
			'Omitted (0)',
			'Named corner scale or an explicit rem/percentage radius.'
		],
		['shadow', 'boolean', 'false', 'Enables a depth shadow.'],
		[
			'hover',
			'BaseSize',
			'Omitted',
			'Optional hover/focus treatment; does not make the root interactive.'
		],
		['scroll', 'boolean', 'false', 'true sets overflow to auto; otherwise overflow stays visible.']
	].map(([name, type, defaultValue, description]) => ({
		name,
		type,
		default: defaultValue,
		description,
		required: false
	}));
</script>

<Page
	title={chapter}
	description="A semantic flex container with theme tints, glass or opaque treatments, shared spacing, corner rounding and optional scrolling."
>
	<Section {...sections[0]}>
		<Surface as="section" variant="soft" spacing="medium" radius="small" aria-label="Details">
			<h2>Details</h2>
			<p>Content inside the surface.</p>
		</Surface>
		<CodeSnippet {source} label="Surface usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-controls>
			<label>
				Element <select bind:value={as}>
					{#each ['div', 'section', 'span'] as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				Variant <select bind:value={variant}>
					{#each variants as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				Tint <select bind:value={tint}>
					{#each colors as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				Spacing <select bind:value={spacing}>
					<option value={undefined}>None</option>
					{#each sizes as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				Orientation <select bind:value={orientation}>
					<option>vertical</option>
					<option>horizontal</option>
				</select>
			</label>
			<label>
				Width <select bind:value={width}>
					<option>fill</option>
					<option>fit</option>
				</select>
			</label>
			<label>
				Height <select bind:value={height}>
					<option>fit</option>
					<option>fill</option>
				</select>
			</label>
			<label>
				Radius <select bind:value={radius}>
					<option value={undefined}>None</option>
					{#each radii as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				Hover <select bind:value={hover}>
					<option value={undefined}>None</option>
					<option>small</option>
					<option>medium</option>
					<option>large</option>
				</select>
			</label>
			<label>
				<input type="checkbox" bind:checked={shadow} />
				Shadow
			</label>
			<label>
				<input type="checkbox" bind:checked={scroll} />
				Scroll
			</label>
		</div>
		<div data-stage>
			<Surface
				id="surface-playground"
				{as}
				{variant}
				{tint}
				{spacing}
				{orientation}
				{width}
				{height}
				{radius}
				{shadow}
				{hover}
				{scroll}
				style="max-height: 100%;"
			>
				<strong>Surface</strong>
				<span>
					Long content stays readable and wraps within narrow layouts. Change the controls to
					explore the container.
				</span>
			</Surface>
		</div>
	</Section>
	<Section {...sections[2]}>
		<p>
			Switch the shared theme control to compare light and dark. Text inherits independently from
			the tint.
		</p>
		<div data-matrix>
			{#each colors as color (color)}
				{#each variants as variant (variant)}
					<Surface tint={color} {variant} spacing="medium" radius="small" data-matrix-surface>
						<strong>{color}</strong>
						<span>{variant}</span>
					</Surface>
				{/each}
			{/each}
		</div>
	</Section>
	<Section {...sections[3]}>
		<div data-matrix>
			{#each sizes as size (size)}
				<Surface spacing={size} radius={size} variant="soft">
					<strong>{size}</strong>
					<span>Padding and gap share a scale.</span>
				</Surface>
			{/each}
			<Surface>
				<strong>Defaults</strong>
				<span>Transparent, square, with no spacing.</span>
			</Surface>
		</div>
		<div data-row>
			<Surface
				as="span"
				width="fit"
				orientation="horizontal"
				spacing="small"
				radius="50%"
				variant="filled"
			>
				<Icon name="check" />
				<span>Span</span>
			</Surface>
			<Surface width="fit" spacing="small" radius="2rem" variant="soft" shadow>
				<span>Explicit rem radius and shadow</span>
			</Surface>
		</div>
		<div data-sized-parent>
			<Surface height="fill" variant="filled" spacing="small">
				<span>Full parent height</span>
			</Surface>
		</div>
		<Surface variant="filled" spacing="medium" radius="small">
			<TextInput aria-label="Project name" placeholder="Project name" wide />
			<PillGroup {items} aria-label="Project categories" />
			<Surface orientation="horizontal" spacing="small">
				<Spinner label="Loading" /><Progress label="Completion" value={0.6} />
			</Surface>
			<Button label="Save" onClick={() => clicks++} />
		</Surface>
		<p role="status">Saved {clicks} times.</p>
	</Section>
	<Section {...sections[4]}>
		<p>
			Native attributes, lowercase events, class and style pass to the root. Explicit styles
			override the recipe. There is no element binding or automatic click behavior; children is a
			Svelte snippet.
		</p>
		<p>
			Set a height or max-height to constrain scrolling. Tab to the region and use arrow keys to
			scroll. Visible overflow preserves child focus outlines.
		</p>
		<Surface
			id="scroll-surface"
			scroll
			tabindex={0}
			role="region"
			aria-label="Scrollable Surface"
			variant="soft"
			spacing="small"
			radius="small"
			style="max-height: 9rem;"
			onfocus={() => focused++}
		>
			{#each Array.from({ length: 12 }, (_, index) => index + 1) as index (index)}<p>
					Scrollable content, row {index}.
				</p>{/each}
		</Surface>
		<p role="status">Region focused {focused} times.</p>
		<Surface
			id="style-surface"
			spacing="large"
			radius="large"
			class="custom-surface"
			style="padding: 0.75rem; gap: 0.25rem; border-radius: 0.25rem;"
			title="Native style override"
		>
			<strong>Explicit styling</strong>
			<span>Overrides padding, gap and radius.</span>
		</Surface>
		<label>
			<input type="checkbox" bind:checked={hidden} />
			Hide the next Surface
		</label>
		<Surface id="hidden-surface" {hidden} variant="soft" spacing="small">
			<span>Native hidden attribute is preserved.</span>
		</Surface>
		<CodeSnippet
			label="Surface scrolling code"
			source={'<Surface scroll tabindex={0} role="region" aria-label="Results" style="max-height: 12rem;">\n  Content\n</Surface>'}
		/>
	</Section>
	<Section {...sections[5]}>
		<PropTable {props} />
		<p>
			Migration: pass attributes directly instead of stylesOverride; hover replaces hoverEffect.
			Replace capsule with a named size, a rem value, or a percentage radius. Use scroll for
			automatic overflow.
		</p>
	</Section>
</Page>

<style>
	[data-controls],
	[data-row] {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
	}
	label {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	input,
	select {
		max-width: 100%;
	}
	[data-stage] {
		height: 12rem;
		min-width: 0;
	}
	[data-matrix] {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	[data-sized-parent] {
		height: 8rem;
	}
	@media (max-width: 575px) {
		[data-matrix] {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
