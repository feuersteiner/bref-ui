<script lang="ts">
	/* eslint-disable max-lines -- Keep the Surface matrix and interactive examples in their documentation page. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import {
		Surface,
		Button,
		Icon,
		TextInput,
		PillGroup,
		Progress,
		Spinner,
		Select,
		Checkbox
	} from '$lib/index.js';
	import type { Color, Size, SurfaceProps, SurfaceRadius, Variant } from '$lib/types.js';
	import { surface } from '$lib/theme/surface.js';

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
	let clicks = $state(0);
	const items = [
		{ id: 'one', label: 'Design' },
		{ id: 'two', label: 'Development' }
	];
	const source = `<script>
  import { Surface } from 'bref-ui';
<${'/'}script>

<Surface as="section" variant="soft" spacing="medium" radius="small">
  <h2>Details</h2>
  <p>Content inside the surface.</p>
</Surface>`;
	const scrollSource = `<div style="height: 12rem;">
  <Surface scroll height="fill">
    Content
  </Surface>
</div>`;
	const helperSource = `<script>
  import { Theme } from 'bref-ui';
  import { surface } from 'bref-ui/surface';
<${'/'}script>

<Theme />
<button class={surface({ variant: 'filled', color: 'primary', shadow: 'small', hover: 'medium' })}>
  Save
</button>`;
	const props = [
		['as', "'div' | 'section' | 'span'", 'div', 'Native root element.'],
		['children', 'Snippet', 'Omitted', 'Content rendered directly inside the root.'],
		['tint', 'Color', 'background', 'Theme tint; the shared recipe supplies content color.'],
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
		<Surface as="section" variant="soft" spacing="medium" radius="small">
			<h2>Details</h2>
			<p>Content inside the surface.</p>
		</Surface>
		<CodeSnippet {source} label="Surface usage code" />
		<p>
			Render Theme once to load the shared paint recipes. The typed surface helper applies the same
			recipes to native HTML; component styles supply padding, radius and layout.
		</p>
		<div data-row>
			{#each variants as variant (variant)}
				<button
					class={surface({ variant, color: 'primary', shadow: 'small', hover: 'medium' })}
					onclick={() => clicks++}
				>
					{variant}
				</button>
			{/each}
			<button class={surface({ variant: 'filled', color: 'primary', hover: 'medium' })} disabled>
				Disabled
			</button>
		</div>
		<CodeSnippet source={helperSource} label="Typed surface helper usage" />
	</Section>
	<Section {...sections[1]}>
		<div data-controls>
			<div data-control>
				<label for="surface-as">Element</label>
				<Select
					id="surface-as"
					items={['div', 'section', 'span'].map((id) => ({ id, label: id }))}
					bind:value={() => as, (next) => (as = next as typeof as)}
				/>
			</div>
			<div data-control>
				<label for="surface-variant">Variant</label>
				<Select
					id="surface-variant"
					items={variants.map((id) => ({ id, label: id }))}
					bind:value={() => variant, (next) => (variant = next as typeof variant)}
				/>
			</div>
			<div data-control>
				<label for="surface-tint">Tint</label>
				<Select
					id="surface-tint"
					items={colors.map((id) => ({ id, label: id }))}
					bind:value={() => tint, (next) => (tint = next as typeof tint)}
				/>
			</div>
			<div data-control>
				<label for="surface-spacing">Spacing</label>
				<Select
					id="surface-spacing"
					items={[{ id: 'none', label: 'None' }, ...sizes.map((id) => ({ id, label: id }))]}
					bind:value={
						() => spacing ?? 'none',
						(next) => (spacing = next === 'none' ? undefined : (next as typeof spacing))
					}
				/>
			</div>
			<div data-control>
				<label for="surface-orientation">Orientation</label>
				<Select
					id="surface-orientation"
					items={[
						{ id: 'vertical', label: 'vertical' },
						{ id: 'horizontal', label: 'horizontal' }
					]}
					bind:value={() => orientation, (next) => (orientation = next as typeof orientation)}
				/>
			</div>
			<div data-control>
				<label for="surface-width">Width</label>
				<Select
					id="surface-width"
					items={[
						{ id: 'fill', label: 'fill' },
						{ id: 'fit', label: 'fit' }
					]}
					bind:value={() => width, (next) => (width = next as typeof width)}
				/>
			</div>
			<div data-control>
				<label for="surface-height">Height</label>
				<Select
					id="surface-height"
					items={[
						{ id: 'fit', label: 'fit' },
						{ id: 'fill', label: 'fill' }
					]}
					bind:value={() => height, (next) => (height = next as typeof height)}
				/>
			</div>
			<div data-control>
				<label for="surface-radius">Radius</label>
				<Select
					id="surface-radius"
					items={[{ id: 'none', label: 'None' }, ...radii.map((id) => ({ id, label: id }))]}
					bind:value={
						() => radius ?? 'none',
						(next) => (radius = next === 'none' ? undefined : (next as typeof radius))
					}
				/>
			</div>
			<div data-control>
				<label for="surface-hover">Hover</label>
				<Select
					id="surface-hover"
					items={[
						{ id: 'none', label: 'None' },
						{ id: 'small', label: 'small' },
						{ id: 'medium', label: 'medium' },
						{ id: 'large', label: 'large' }
					]}
					bind:value={
						() => hover ?? 'none',
						(next) => (hover = next === 'none' ? undefined : (next as typeof hover))
					}
				/>
			</div>
			<label>
				<Checkbox bind:checked={shadow} />
				Shadow
			</label>
			<label>
				<Checkbox bind:checked={scroll} />
				Scroll
			</label>
		</div>
		<div data-stage id="surface-playground">
			<Surface
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
			Switch the shared theme control to compare light and dark. Filled uses a strong opaque tint;
			background-tinted panels retain the foreground text color.
		</p>
		<div data-matrix>
			{#each colors as color (color)}
				{#each variants as variant (variant)}
					<div data-matrix-cell>
						<Surface tint={color} {variant} spacing="medium" radius="small">
							<strong>{color}</strong>
							<span>{variant}</span>
						</Surface>
					</div>
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
			Surface accepts only the listed props. Content uses a Svelte children snippet; place native
			attributes, events and styling on surrounding HTML elements.
		</p>
		<p>
			Give the parent a fixed height and use height="fill" to constrain scrolling. A scrollable
			Surface can receive keyboard focus; use arrow keys to scroll.
		</p>
		<div id="scroll-surface" data-scroll-demo>
			<Surface scroll height="fill" variant="soft" spacing="small" radius="small">
				{#each Array.from({ length: 12 }, (_, index) => index + 1) as index (index)}
					<p>Scrollable content, row {index}.</p>
				{/each}
			</Surface>
		</div>
		<CodeSnippet label="Surface scrolling code" source={scrollSource} />
	</Section>
	<Section {...sections[5]}>
		<PropTable {props} />
		<p>
			Migration: move stylesOverride attributes to surrounding HTML; hover replaces hoverEffect.
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
	button {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font: inherit;
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
	[data-matrix-cell] {
		min-width: 0;
	}
	[data-scroll-demo] {
		height: 9rem;
	}
	[data-sized-parent] {
		height: 8rem;
	}
	@media (max-width: 575px) {
		[data-matrix] {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	[data-control] {
		display: grid;
		gap: 0.5rem;
		width: min(100%, 12rem);
		min-width: 0;
	}
</style>
