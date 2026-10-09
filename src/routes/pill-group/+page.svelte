<script lang="ts">
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Button, PillGroup, Select } from '$lib/index.js';
	import type { Color, Size, Variant } from '$lib/types.js';

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
	let previewItems = $state([...items]);
	let size = $state<Size>('medium');
	let variant = $state<Variant>('neutral');
	let color = $state<Exclude<Color, 'background'>>('foreground');
	const props = [
		{
			name: 'items',
			type: 'readonly PillDataProps[]',
			required: true,
			default: '—',
			description: 'Items with unique IDs, labels and optional icons.'
		},
		{
			name: 'onDelete',
			type: '(id: string) => void',
			required: false,
			default: 'Omitted',
			description: 'Show delete buttons and report the item ID; the consumer updates items.'
		},
		{ name: 'size', type: 'Size', required: false, default: 'medium', description: 'Pill size.' },
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
			description: 'Theme color shared by the Pills.'
		}
	];
</script>

<Page title={chapter} description="A list of Pills for related categories or statuses.">
	<Section {...sections[0]}>
		<PillGroup {items} aria-label="Document categories" />
		<CodeSnippet
			label="PillGroup usage code"
			source={`<script>\n  import { PillGroup } from 'bref-ui';\n  const items = [{ id: 'draft', label: 'Draft', icon: { name: 'draft' } }, { id: 'review', label: 'In review' }];\n<${'/'}script>\n\n<PillGroup {items} aria-label="Document categories" />`}
		/>
	</Section>
	<Section {...sections[1]}>
		<div data-controls>
			<div data-control>
				<label for="pill-group-size">Size</label>
				<Select
					id="pill-group-size"
					items={sizes.map((id) => ({ id, label: id }))}
					bind:value={() => size, (next) => (size = next as typeof size)}
				/>
			</div>
			<div data-control>
				<label for="pill-group-variant">Variant</label>
				<Select
					id="pill-group-variant"
					items={variants.map((id) => ({ id, label: id }))}
					bind:value={() => variant, (next) => (variant = next as typeof variant)}
				/>
			</div>
			<div data-control>
				<label for="pill-group-color">Color</label>
				<Select
					id="pill-group-color"
					items={colors.map((id) => ({ id, label: id }))}
					bind:value={() => color, (next) => (color = next as typeof color)}
				/>
			</div>
		</div>
		<PillGroup
			items={previewItems}
			{size}
			{variant}
			{color}
			aria-label="Document categories preview"
			onDelete={(id) => {
				previewItems = previewItems.filter((item) => item.id !== id);
			}}
		/>
		<Button
			label="Reset items"
			onClick={() => {
				previewItems = [...items];
			}}
		/>
		{#each sizes as size (size)}
			<div data-size-demo>
				<span>{size}</span>
				<PillGroup
					items={previewItems}
					{size}
					variant="soft"
					aria-label={`${size} categories`}
					onDelete={(id) => {
						previewItems = previewItems.filter((item) => item.id !== id);
					}}
				/>
			</div>
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
	[data-size-demo] {
		display: grid;
		gap: 0.5rem;
	}
	[data-controls] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}
	label {
		display: grid;
		gap: 0.5rem;
	}
	[data-control] {
		display: grid;
		gap: 0.5rem;
		width: min(100%, 12rem);
		min-width: 0;
	}
</style>
