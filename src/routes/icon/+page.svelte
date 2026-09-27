<script lang="ts">
	/* eslint-disable max-lines -- Keep the prop matrix and interactive examples in their documentation page. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Icon } from '$lib/index.js';
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
	const source = `<script>
  import { Icon } from 'bref';
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
	description="Material Symbols with inherited size and color, optional fill and accessible names."
>
	<Section {...sections[0]}>
		<div data-demo="row">
			<Icon name="check_circle" label="Complete" />
			<Icon name="favorite" filled size="large" color="secondary" />
		</div>
		<CodeSnippet {source} />
	</Section>
	<Section {...sections[1]}>
		<div data-demo="controls">
			<label
				>Name <select bind:value={name}
					>{#each names as value (value)}<option>{value}</option>{/each}</select
				></label
			>
			<label
				>Size <select bind:value={size}
					><option value="">Inherited</option>{#each sizes as value (value)}<option>{value}</option
						>{/each}</select
				></label
			>
			<label
				>Color <select bind:value={color}
					><option value="">Inherited</option>{#each colors as value (value)}<option>{value}</option
						>{/each}</select
				></label
			>
			<label>Accessible label <input bind:value={label} /></label>
			<label><input type="checkbox" bind:checked={filled} /> Filled</label>
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
			source={`<Icon name="${name}" filled={${filled}}${size ? ` size="${size}"` : ''}${color ? ` color="${color}"` : ''}${label ? ` label={${JSON.stringify(label)}}` : ''} />`}
		/>
	</Section>
	<Section {...sections[2]}>
		<div data-demo="matrix">
			<p>
				Every size, color and fill combination. Background-colored icons match the page surface.
			</p>
			{#each colors as color (color)}
				<h3>{color}</h3>
				<div data-demo="row">
					{#each sizes as size (size)}
						<figure>
							<div data-demo="row">
								<Icon name="favorite" {size} {color} /><Icon
									name="favorite"
									{size}
									{color}
									filled
								/>
							</div>
							<figcaption>{size}: outline / filled</figcaption>
						</figure>
					{/each}
				</div>
			{/each}
		</div>
		<h3>Different glyphs</h3>
		<div data-demo="row">
			{#each names as name (name)}<figure>
					<Icon {name} size="large" /><Icon {name} size="large" filled />
					<figcaption>{name}</figcaption>
				</figure>{/each}
		</div>
	</Section>
	<Section {...sections[3]}><PropTable {props} /></Section>
	<Section {...sections[4]}>
		<p>
			Icons inherit surrounding font size and color unless explicitly set. Native span attributes
			and events pass through, including <code>class</code> and <code>style</code>. Icon does not
			accept a children snippet or expose an element binding.
		</p>
		<p>
			Load the Material Symbols font through <code>Theme</code> or an application font-face declaration.
			The documentation layout loads Theme so these examples render the actual glyphs.
		</p>
		<div data-demo="inherited"><Icon name="star" /> Inherited size and color</div>
		<Icon
			name="star"
			class="custom-icon"
			style="font-size: 3rem; color: var(--color-secondary);"
			title="Native span title"
		/>
		<CodeSnippet
			source={`<span style="font-size: 2rem; color: var(--color-primary);"><Icon name="star" /> Inherited size and color</span>
<Icon name="star" class="custom-icon" style="font-size: 3rem; color: var(--color-secondary);" title="Native span title" />`}
		/>
	</Section>
	<Section {...sections[5]}>
		<p>
			Icons without <code>label</code> are decorative and hidden from assistive technology. Labeled
			icons have <code>role="img"</code> and an accessible name.
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
</Page>

<style>
	[data-demo='row'],
	[data-demo='controls'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}
	[data-demo='matrix'] {
		display: grid;
		gap: 1rem;
	}
	[data-demo='inherited'] {
		font-size: 2rem;
		color: var(--color-primary);
	}
	figure {
		display: grid;
		gap: 0.5rem;
	}
	figcaption {
		font-size: 0.875rem;
	}
	input,
	select {
		max-width: 100%;
	}
</style>
