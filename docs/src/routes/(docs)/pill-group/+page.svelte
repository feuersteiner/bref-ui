<script lang="ts">
	import { componentDocs } from 'bref-ui/docs';
	import ComponentUsage from '../components/component-usage.svelte';
	/* eslint-disable max-lines -- Keep interactive group states and gallery examples together. */
	import { chapter, sections } from './sections.js';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import DemoGroup from '../components/demo-group.svelte';
	import MovingBackground from '../components/moving-background.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { PillGroup, Select, Checkbox } from 'bref-ui';
	import type { Color, Size, Variant, PillDataProps } from 'bref-ui/types';

	const doc = componentDocs['pill-group'];
	const props = doc.props;

	const items = [
		{ id: 'draft', label: 'Draft', icon: { name: 'draft' } },
		{ id: 'review', label: 'In review' },
		{ id: 'long', label: 'A longer category that wraps on small screens' }
	] as const;
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
	let previewItems = $state<PillDataProps[]>([...items]);
	let size = $state<Size>('medium');
	let variant = $state<Variant>('neutral');
	let color = $state<Exclude<Color, 'background'>>('foreground');
	let glass = $state(false);
	let movingBackground = $state(false);
	let deleteEnabled = $state(true);
	let showIcons = $state(true);
	let longLabels = $state(true);
	const renderedItems = $derived(
		previewItems.map((item) => ({
			...item,
			icon: showIcons ? item.icon : undefined,
			label: item.id === 'long' && !longLabels ? 'Category' : item.label
		}))
	);
	const reset = () => {
		previewItems = [...items];
		size = 'medium';
		variant = 'neutral';
		color = 'foreground';
		glass = false;
		movingBackground = false;
		deleteEnabled = true;
		showIcons = true;
		longLabels = true;
	};
	const playgroundSource = $derived(`<script lang="ts">
  import { PillGroup } from 'bref-ui';
  import type { PillDataProps } from 'bref-ui/types';
  let items = $state<PillDataProps[]>(${JSON.stringify(renderedItems, null, 2)});
<${'/'}script>

<PillGroup {items} size="${size}" variant="${variant}" color="${color}"
  glass={${glass}} aria-label="Document categories preview"${deleteEnabled ? '\n  onDelete={(id) => items = items.filter((item) => item.id !== id)}' : ''} />`);
</script>

<Page title={chapter} description={doc.description}>
	<Section {...sections[0]}>
		<PillGroup {items} aria-label="Document categories" />
		<ComponentUsage usage={doc.usage} />
	</Section>
	<Section {...sections[1]}>
		<Playground source={playgroundSource} onReset={reset}>
			{#snippet preview()}<div data-playground-stage>
					{#if movingBackground}<MovingBackground />{/if}
					<div data-playground-content>
						<PillGroup
							items={renderedItems}
							{size}
							{variant}
							{color}
							{glass}
							aria-label="Document categories preview"
							onDelete={deleteEnabled
								? (id) => (previewItems = previewItems.filter((item) => item.id !== id))
								: undefined}
						/>
					</div>
				</div>{/snippet}
			{#snippet status()}<span role="status">
					{previewItems.length} categories remaining
				</span>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="pill-group-size" label="Size">
					<Select
						id="pill-group-size"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => size, (next) => (size = next as typeof size)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-group-variant" label="Variant">
					<Select
						id="pill-group-variant"
						items={variants.map((id) => ({ id, label: id }))}
						bind:value={() => variant, (next) => (variant = next as typeof variant)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-group-color" label="Color">
					<Select
						id="pill-group-color"
						items={colors.map((id) => ({ id, label: id }))}
						bind:value={() => color, (next) => (color = next as typeof color)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-group-glass" label="Glass" toggle>
					<Checkbox id="pill-group-glass" bind:checked={glass} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Content">
				<PlaygroundField id="pill-group-showIcons" label="Item icons" toggle>
					<Checkbox id="pill-group-showIcons" bind:checked={showIcons} />
				</PlaygroundField>
				<PlaygroundField id="pill-group-longLabels" label="Long labels" toggle>
					<Checkbox id="pill-group-longLabels" bind:checked={longLabels} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Interaction">
				<PlaygroundField id="pill-group-deleteEnabled" label="Enable delete" toggle>
					<Checkbox id="pill-group-deleteEnabled" bind:checked={deleteEnabled} />
				</PlaygroundField>
				<PlaygroundField id="pill-group-movingBackground" label="Moving background" toggle>
					<Checkbox id="pill-group-movingBackground" bind:checked={movingBackground} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
		{#each sizes as size (size)}
			<DemoGroup title={size}>
				<PillGroup
					items={previewItems}
					{size}
					variant="soft"
					aria-label={`${size} categories`}
					onDelete={(id) => {
						previewItems = previewItems.filter((item) => item.id !== id);
					}}
				/>
			</DemoGroup>
		{/each}
	</Section>
	<Section {...sections[2]}>
		<PropTable {props} label="PillGroup props" />
		<p>
			PillGroup accepts native list attributes. Give the list an accessible name when its context
			does not identify it. Delete callbacks report an ID; update the list in the consumer.
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
</style>
