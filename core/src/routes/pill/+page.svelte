<script lang="ts">
	/* eslint-disable max-lines -- Keep the Pill gallery matrix and usage together. */
	import { chapter, sections } from './sections.js';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import DemoGroup from '../components/demo-group.svelte';
	import MovingBackground from '../components/moving-background.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Pill, TextInput, Select, Checkbox } from '$lib/index.js';
	import type { Color, Size, Variant, IconName } from '$lib/types.js';

	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const variants = ['neutral', 'soft', 'filled'] as const;
	const glassUsage = '<Pill label="Glass" color="primary" glass />';
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
	let glass = $state(false);
	let movingBackground = $state(false);
	let swoosh = $state(false);
	let showIcon = $state(true);
	let iconName = $state<IconName>('star');
	const iconNames = ['star', 'check', 'favorite', 'info', 'folder'] as const;
	let iconFilled = $state(false);
	let clickEnabled = $state(false);
	let deleteEnabled = $state(false);
	let showChildren = $state(false);
	const reset = () => {
		size = 'medium';
		variant = 'neutral';
		color = 'foreground';
		label = 'Status';
		wide = false;
		glass = false;
		movingBackground = false;
		swoosh = false;
		showIcon = true;
		iconName = 'star';
		iconFilled = false;
		clickEnabled = false;
		deleteEnabled = false;
		showChildren = false;
		clicked = 0;
		removed = 0;
	};
	const playgroundSource = $derived(`<script>
  import { Pill } from 'bref-ui';${clickEnabled ? '\n  let clicks = $state(0);' : ''}${deleteEnabled ? '\n  let removals = $state(0);' : ''}
<${'/'}script>

<Pill label={${JSON.stringify(label)}} size="${size}" variant="${variant}" color="${color}"
  wide={${wide}} glass={${glass}} swoosh={${swoosh}}${showIcon ? `\n  icon={{ name: ${JSON.stringify(iconName)}, filled: ${iconFilled} }}` : ''}${clickEnabled ? '\n  onClick={() => clicks++}' : ''}${deleteEnabled ? '\n  onDelete={() => removals++}' : ''}
  title="Native title attribute"${showChildren ? '>\n  <strong>snippet</strong>\n</Pill>' : ' />'}${clickEnabled || deleteEnabled ? '\n<p role="status">' + (clickEnabled ? 'Clicks: {clicks} ' : '') + (deleteEnabled ? 'Removals: {removals}' : '') + '</p>' : ''}`);
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
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Translucent paint and backdrop blur.'
		}
	];
</script>

<Page
	title={chapter}
	description="A compact glass label for status, categories and optional actions."
>
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
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={reset}>
			{#snippet preview()}
				<div data-playground-stage>
					{#if movingBackground}<MovingBackground />{/if}
					<div data-playground-content>
						<Pill
							{label}
							{size}
							{variant}
							{color}
							{wide}
							{glass}
							{swoosh}
							icon={showIcon ? { name: iconName, filled: iconFilled } : undefined}
							onClick={clickEnabled ? () => clicked++ : undefined}
							onDelete={deleteEnabled ? () => removed++ : undefined}
							title="Native title attribute"
						>
							{#if showChildren}<strong>snippet</strong>{/if}
						</Pill>
					</div>
				</div>
			{/snippet}
			{#snippet status()}<span role="status">Clicks: {clicked}; removals: {removed}</span>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="pill-size" label="Size">
					<Select
						id="pill-size"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => size, (next) => (size = next as typeof size)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-variant" label="Variant">
					<Select
						id="pill-variant"
						items={variants.map((id) => ({ id, label: id }))}
						bind:value={() => variant, (next) => (variant = next as typeof variant)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-color" label="Color">
					<Select
						id="pill-color"
						items={colors.map((id) => ({ id, label: id }))}
						bind:value={() => color, (next) => (color = next as typeof color)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-glass" label="Glass" toggle>
					<Checkbox id="pill-glass" bind:checked={glass} />
				</PlaygroundField>
				<PlaygroundField id="pill-wide" label="Wide" toggle>
					<Checkbox id="pill-wide" bind:checked={wide} />
				</PlaygroundField>
				<PlaygroundField id="pill-swoosh" label="Animate highlight" toggle>
					<Checkbox id="pill-swoosh" bind:checked={swoosh} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Content">
				<PlaygroundField id="pill-label" label="Label">
					<TextInput id="pill-label" bind:value={label} />
				</PlaygroundField>
				<PlaygroundField id="pill-showIcon" label="Leading icon" toggle>
					<Checkbox id="pill-showIcon" bind:checked={showIcon} />
				</PlaygroundField>
				<PlaygroundField id="pill-iconName" label="Icon name">
					<Select
						id="pill-iconName"
						items={iconNames.map((id) => ({ id, label: id }))}
						bind:value={() => iconName, (next) => (iconName = next as IconName)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-iconFilled" label="Filled icon" toggle>
					<Checkbox id="pill-iconFilled" bind:checked={iconFilled} />
				</PlaygroundField>
				<PlaygroundField id="pill-showChildren" label="Children snippet" toggle>
					<Checkbox id="pill-showChildren" bind:checked={showChildren} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Interaction">
				<PlaygroundField id="pill-clickEnabled" label="Enable click" toggle>
					<Checkbox id="pill-clickEnabled" bind:checked={clickEnabled} />
				</PlaygroundField>
				<PlaygroundField id="pill-deleteEnabled" label="Enable delete" toggle>
					<Checkbox id="pill-deleteEnabled" bind:checked={deleteEnabled} />
				</PlaygroundField>
				<PlaygroundField id="pill-movingBackground" label="Moving background" toggle>
					<Checkbox id="pill-movingBackground" bind:checked={movingBackground} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections[2]}>
		<DemoGroup title="Interactions and snippets">
			<div data-demo="row">
				<Pill label="Clickable" onClick={() => clicked++} />
				<Pill label="Removable" onDelete={() => removed++} />
				<Pill label="Combined" onClick={() => clicked++} onDelete={() => removed++} />
				<Pill label="Animated" swoosh />
				<Pill label="Content" icon={{ name: 'star' }}><strong>snippet</strong></Pill>
			</div>
			<p role="status">Clicks: {clicked}; removals: {removed}</p>
		</DemoGroup>
		<Pill label="Full-width Pill" {size} {variant} {color} wide />
		{#each variants as variant (variant)}
			<DemoGroup title={variant}>
				<div data-demo="row">
					{#each colors as color (color)}<Pill {variant} {color} label={color} />{/each}
				</div>
			</DemoGroup>
		{/each}
		<DemoGroup title="Sizes and long content">
			<div data-demo="row">
				{#each sizes as size (size)}
					<Pill {size} color="primary" label={size} icon={{ name: 'check' }} />
					<Pill
						{size}
						color="primary"
						label={size}
						icon={{ name: 'check' }}
						onDelete={() => removed++}
					/>
				{/each}<Pill
					color="primary"
					label="A long category label that wraps on a narrow screen without losing its meaning"
				/>
			</div>
		</DemoGroup>
	</Section>
	<Section {...sections[3]}>
		<p>Compare glass and regular Pills over a swirling, striped background.</p>
		<div data-background-demo>
			{#each variants as variant (variant)}
				<div data-variant-demo>
					<strong>{variant}</strong>
					<Pill label="Without glass" color="primary" {variant} wide />
					<Pill label="Glass" color="primary" {variant} glass wide />
					<Pill
						label="Removable"
						icon={{ name: 'star' }}
						{variant}
						glass
						wide
						onDelete={() => removed++}
					/>
				</div>
			{/each}
		</div>
		<CodeSnippet label="Glass Pill usage code" source={glassUsage} />
	</Section>
	<Section {...sections[4]}>
		<PropTable {props} label="Pill props" />
		<p>
			Pill accepts native div attributes and a children snippet. A clickable Pill supports Enter and
			Space; its remove button has a separate accessible name.
		</p>
	</Section>
</Page>

<style>
	[data-playground-stage] {
		position: relative;
		isolation: isolate;
		display: grid;
		align-content: center;
		gap: 20px;
		min-width: 0;
		min-height: 240px;
		padding: 24px;
	}
	[data-playground-content] {
		position: relative;
		min-width: 0;
	}

	[data-demo='row'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
	}
	[data-background-demo] {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.5rem;
		padding: 1.5rem;
		border-radius: 1rem;
		background:
			radial-gradient(ellipse at 15% 20%, var(--color-primary), transparent 55%),
			radial-gradient(ellipse at 85% 80%, var(--color-secondary), transparent 55%),
			repeating-conic-gradient(
				from 30deg at 50% 50%,
				var(--color-background) 0deg 12deg,
				color-mix(in srgb, var(--color-info) 35%, var(--color-background)) 12deg 24deg
			);
	}
	[data-variant-demo] {
		display: grid;
		gap: 1rem;
		min-width: 0;
		align-content: start;
	}
	@media (max-width: 575px) {
		[data-background-demo] {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
