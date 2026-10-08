<script lang="ts">
	/* eslint-disable max-lines -- Keep the prop matrix and interactive examples in their documentation page. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Button, Icon, Select, TextInput, Checkbox } from '$lib/index.js';
	import type { Color, Size, IconName } from '$lib/types.js';
	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const colors = [
		'primary',
		'secondary',
		'foreground',
		'background',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	] as const;
	const names = [
		'check_circle',
		'favorite',
		'star',
		'home',
		'search',
		'settings',
		'warning',
		'error',
		'save',
		'arrow_forward'
	] as const;
	let name = $state<IconName>('favorite');
	let size = $state<Size | ''>('');
	let color = $state<Color | ''>('');
	let filled = $state(false);
	let label = $state('Favorite');
	let matrixOpen = $state(false);
	const source = `<script>
  import { Icon } from 'bref-ui';
<${'/'}script>

<Icon name="check_circle" label="Complete" />
<Icon name="favorite" filled size="large" color="secondary" />`;

	const props = [
		{
			name: 'name',
			type: 'IconName',
			required: true,
			default: '—',
			description: 'Material Symbols identifier.'
		},
		{
			name: 'filled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Use the filled glyph variant.'
		},
		{
			name: 'label',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Accessible name for a meaningful standalone icon.'
		},
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'Inherited',
			description: 'x-small, small, medium, large or x-large.'
		},
		{
			name: 'color',
			type: 'Color',
			required: false,
			default: 'Inherited',
			description:
				'primary, secondary, foreground, background, muted, info, success, warning or error.'
		}
	];
</script>

<Page
	title={chapter}
	description="Render Material Symbols by name, with inherited or explicit size and color, optional fill, and accessible labels. Load the Material Symbols font through Theme or your app's font-face declaration."
>
	<Section {...sections[0]}>
		<div data-demo="row">
			<Icon name="check_circle" label="Complete" />
			<Icon name="favorite" filled size="large" color="secondary" />
		</div>
		<CodeSnippet {source} label="Icon usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-demo="controls">
			<div data-control>
				<label for="icon-name">Name</label>
				<Select
					id="icon-name"
					items={names.map((id) => ({ id, label: id }))}
					bind:value={() => name, (next) => (name = next as typeof name)}
				/>
			</div>
			<div data-control>
				<label for="icon-size">Size</label>
				<Select
					id="icon-size"
					items={[{ id: '', label: 'Inherited' }, ...sizes.map((id) => ({ id, label: id }))]}
					bind:value={() => size, (next) => (size = next as typeof size)}
				/>
			</div>
			<div data-control>
				<label for="icon-color">Color</label>
				<Select
					id="icon-color"
					items={[{ id: '', label: 'Inherited' }, ...colors.map((id) => ({ id, label: id }))]}
					bind:value={() => color, (next) => (color = next as typeof color)}
				/>
			</div>
			<label>
				Accessible label <TextInput bind:value={label} />
			</label>
			<label data-toggle>
				<Checkbox bind:checked={filled} />
				Filled
			</label>
		</div>
		<div data-demo="inherited">
			<Icon
				{name}
				size={size || undefined}
				color={color || undefined}
				{filled}
				label={label || undefined}
			/>
		</div>
		<p>
			Clear the label to make the icon decorative. Omitted size and color inherit from the
			container.
		</p>
		<CodeSnippet
			label="Icon playground code"
			source={`<Icon name="${name}" filled={${filled}}${size ? ` size="${size}"` : ''}${color ? ` color="${color}"` : ''}${label ? ` label={${JSON.stringify(label)}}` : ''} />`}
		/>
	</Section>
	<Section {...sections[2]}>
		<p>
			The five sizes use 16, 20, 24, 32 and 40 pixels at the default root font size. Outline and
			filled icons keep the same light stroke weight and align with surrounding text.
		</p>
		<div data-demo="matrix">
			<p>
				Representative size, color and fill axes stay visible without mounting every combination.
			</p>
			<h3>Sizes and fill</h3>
			<div data-demo="row">
				{#each sizes as size (size)}
					<figure>
						<div data-demo="row">
							<Icon name="favorite" {size} color="primary" />
							<Icon name="favorite" {size} color="primary" filled />
						</div>
						<figcaption>{size}: outline / filled</figcaption>
					</figure>
				{/each}
			</div>
			<h3>Colors and fill</h3>
			<div data-demo="row">
				{#each colors as color (color)}
					<figure>
						<div data-demo="row">
							<Icon name="favorite" size="medium" {color} />
							<Icon name="favorite" size="medium" {color} filled />
						</div>
						<figcaption>{color}: outline / filled</figcaption>
					</figure>
				{/each}
			</div>
		</div>
		<h3>Different glyphs</h3>
		<div data-demo="row">
			{#each names as name (name)}<figure>
					<Icon {name} size="large" />
					<figcaption>{name}</figcaption>
				</figure>{/each}
		</div>
		<p>The exhaustive color × size × fill matrix is mounted only when requested.</p>
		<div data-demo="row">
			<Button
				label={matrixOpen ? 'Hide exhaustive matrix' : 'Load exhaustive matrix'}
				color="primary"
				variant="soft"
				onClick={() => (matrixOpen = !matrixOpen)}
				aria-controls="exhaustive-icon-matrix"
				aria-expanded={matrixOpen}
			/>
		</div>
		<div id="exhaustive-icon-matrix">
			{#if matrixOpen}
				<div data-demo="matrix">
					<p>Every size, color and fill combination.</p>
					{#each colors as color (color)}
						<h3>{color}</h3>
						<div data-demo="row">
							{#each sizes as size (size)}
								<figure>
									<div data-demo="row">
										<Icon name="favorite" {size} {color} />
										<Icon name="favorite" {size} {color} filled />
									</div>
									<figcaption>{size}: outline / filled</figcaption>
								</figure>
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</Section>
	<Section {...sections[3]}><PropTable {props} /></Section>
	<Section {...sections[4]}>
		<p>
			Icons inherit surrounding font size and color unless explicitly set. Native span attributes
			and events pass through, including <code>class</code>
			and
			<code>style</code>
			. Icon does not accept a children snippet or expose an element binding.
		</p>
		<p>
			Load the Material Symbols font through <code>Theme</code>
			or an application font-face declaration. The documentation layout loads Theme so these examples
			render the actual glyphs.
		</p>
		<div data-demo="inherited"><Icon name="star" /> Inherited size and color</div>
		<Icon
			name="star"
			class="custom-icon"
			style="font-size: 3rem; color: var(--color-secondary);"
			title="Native span title"
		/>
		<CodeSnippet
			label="Icon composition code"
			source={`<span style="font-size: 2rem; color: var(--color-primary);"><Icon name="star" /> Inherited size and color</span>
<Icon name="star" class="custom-icon" style="font-size: 3rem; color: var(--color-secondary);" title="Native span title" />`}
		/>
	</Section>
	<Section {...sections[5]}>
		<p>
			Icons without <code>label</code>
			are decorative and hidden from assistive technology. Labeled icons have
			<code>role="img"</code>
			and an accessible name.
		</p>
		<p>
			Put action names on containing buttons and leave their icons decorative. Icons alone are not
			interactive controls.
		</p>
		<div data-demo="row">
			<Icon name="check_circle" label="Complete" />
			<span><Icon name="check_circle" /> Complete (decorative icon beside visible text)</span>
		</div>
	</Section>
	<Section {...sections[6]}>
		<p>
			Google Fonts Icons is a catalog for browsing and customizing Material Symbols. Find a symbol's
			identifier there, then pass it to the <code>name</code>
			prop. This component requires the Material Symbols font to be loaded by
			<code>Theme</code>
			or your application.
		</p>
		<p>
			<a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer">
				Browse Google Fonts Icons
			</a>
		</p>
	</Section>
</Page>

<style>
	[data-demo='row'],
	[data-demo='controls'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px;
	}
	[data-demo='controls'] > label {
		display: grid;
		gap: 12px;
		color: var(--color-muted);
	}
	[data-demo='controls'] > label[data-toggle] {
		grid-template-columns: auto 1fr;
		align-items: center;
		color: var(--color-foreground);
	}
	[data-demo='matrix'] {
		display: grid;
		gap: 24px;
	}
	[data-demo='inherited'] {
		font-size: 2rem;
		color: var(--color-primary);
	}
	figure {
		display: grid;
		gap: 12px;
	}
	figcaption {
		font-size: 0.875rem;
	}
	[data-control] {
		display: grid;
		gap: 0.5rem;
		width: min(100%, 12rem);
		min-width: 0;
	}
</style>
