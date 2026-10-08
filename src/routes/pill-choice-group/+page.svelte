<script lang="ts">
	/* eslint-disable max-lines -- Keep this page's controls, selection demos and documentation together. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import type { Color, Size, Variant } from '$lib/types.js';
	import { Button, PillChoiceGroup, Select, Checkbox, Switch } from '$lib/index.js';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import MovingBackground from '../components/moving-background.svelte';

	const items = [
		{ id: 'focus', label: 'Focus', icon: { name: 'center_focus_strong' } },
		{ id: 'calm', label: 'Calm' },
		{ id: 'energy', label: 'Energy' }
	] as const;
	let moodItems = $state([...items]);
	let filterItems = $state([...items]);
	let mood = $state('focus');
	let filters = $state(['focus', 'calm']);
	let movingBackground = $state(false);
	let size = $state<Size>('medium');
	let variant = $state<Exclude<Variant, 'filled'>>('neutral');
	let color = $state<Exclude<Color, 'background'>>('foreground');
	let disabled = $state(false);
	let animateSelected = $state(false);
	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const variants = ['neutral', 'soft'] as const;
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
	const props = [
		{
			name: 'items',
			type: 'readonly PillDataProps[]',
			required: true,
			default: '—',
			description: 'Choices with unique IDs and visible labels; icons are optional.'
		},
		{
			name: 'selection',
			type: 'string | string[]',
			required: true,
			default: '—',
			description: 'Bindable ID for radio choice, or IDs for checkboxes.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disable every choice.'
		},
		{
			name: 'onDelete',
			type: '(id: string) => void',
			required: false,
			default: 'Omitted',
			description:
				'Show delete buttons and report the item ID; the consumer updates items and selection.'
		},
		{ name: 'size', type: 'Size', required: false, default: 'medium', description: 'Pill size.' },
		{
			name: 'variant',
			type: "Exclude<Variant, 'filled'>",
			required: false,
			default: 'neutral',
			description: 'Neutral selects soft; soft selects filled.'
		},
		{
			name: 'color',
			type: "Exclude<Color, 'background'>",
			required: false,
			default: 'foreground',
			description: 'Theme role for every pill, including selected choices.'
		},
		{
			name: 'animateSelected',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Enable the pill highlight animation.'
		}
	];
</script>

<Page title={chapter} description="Single or multiple choices presented as a group of Pills.">
	<Section {...sections[0]}>
		<PillChoiceGroup {items} selection="focus" aria-label="Example mood" />
		<CodeSnippet
			label="PillChoiceGroup usage code"
			source={`<script>\n  import { PillChoiceGroup } from 'bref-ui';\n  const items = [{ id: 'focus', label: 'Focus' }, { id: 'calm', label: 'Calm' }];\n  let selection = $state('focus');\n<${'/'}script>\n\n<PillChoiceGroup {items} aria-label="Mood" bind:selection />`}
		/>
	</Section>
	<Section {...sections[1]}>
		<div data-controls>
			<div data-control>
				<label for="pill-choice-group-size">Size</label>
				<Select
					id="pill-choice-group-size"
					items={sizes.map((id) => ({ id, label: id }))}
					bind:value={() => size, (next) => (size = next as typeof size)}
				/>
			</div>
			<div data-control>
				<label for="pill-choice-group-variant">Variant</label>
				<Select
					id="pill-choice-group-variant"
					items={variants.map((id) => ({ id, label: id }))}
					bind:value={() => variant, (next) => (variant = next as typeof variant)}
				/>
			</div>
			<div data-control>
				<label for="pill-choice-group-color">Color</label>
				<Select
					id="pill-choice-group-color"
					items={colors.map((id) => ({ id, label: id }))}
					bind:value={() => color, (next) => (color = next as typeof color)}
				/>
			</div>
			<label>
				<Checkbox bind:checked={disabled} />
				Disabled
			</label>
			<label>
				<Checkbox bind:checked={animateSelected} />
				Animate selected
			</label>
		</div>
		<label data-background-toggle>
			<Switch bind:checked={movingBackground} />
			Moving background
		</label>
		<form>
			{#if movingBackground}<MovingBackground />{/if}
			<div data-choice-demo>
				<strong>Single selection</strong>
				<PillChoiceGroup
					items={moodItems}
					{size}
					{variant}
					{color}
					{disabled}
					{animateSelected}
					aria-label="Mood"
					bind:selection={mood}
					onDelete={(id) => {
						moodItems = moodItems.filter((item) => item.id !== id);
						if (mood === id) mood = '';
					}}
				/>
				<p>Single selection: {mood || 'none'}</p>
			</div>
			<div data-choice-demo>
				<strong>Multiple selection</strong>
				<PillChoiceGroup
					items={filterItems}
					{size}
					{variant}
					{color}
					{disabled}
					{animateSelected}
					aria-label="Filters"
					bind:selection={filters}
					onDelete={(id) => {
						filterItems = filterItems.filter((item) => item.id !== id);
						filters = filters.filter((selected) => selected !== id);
					}}
				/>
				<p>Multiple selection: {filters.join(', ') || 'none'}</p>
			</div>
			<div data-choice-demo>
				<strong>Disabled choices</strong>
				<PillChoiceGroup
					{items}
					{size}
					{variant}
					{color}
					{animateSelected}
					aria-label="Unavailable choices"
					disabled
					selection="calm"
				/>
			</div>
			<div data-reset>
				<Button
					label="Reset choices"
					onClick={(event) => {
						moodItems = [...items];
						filterItems = [...items];
						(event.currentTarget as HTMLButtonElement).form?.reset();
					}}
				/>
			</div>
		</form>
		<div data-choice-demo>
			<strong>Animated choices</strong>
			<PillChoiceGroup
				{items}
				selection="focus"
				color="primary"
				animateSelected
				aria-label="Animated choices"
			/>
		</div>
		{#each variants as variant (variant)}
			<fieldset>
				<legend>{variant}</legend>
				{#each colors as color (color)}
					<div data-choice-demo>
						<strong>{color}</strong>
						<PillChoiceGroup
							{items}
							{variant}
							{color}
							selection="focus"
							aria-label={`${color} ${variant} choices`}
						/>
					</div>
				{/each}
			</fieldset>
		{/each}
		{#each sizes as size (size)}
			<div data-choice-demo>
				<span>{size}</span>
				<PillChoiceGroup {items} {size} selection="focus" aria-label={`${size} single choices`} />
				<PillChoiceGroup
					{items}
					{size}
					selection={['focus']}
					variant="soft"
					aria-label={`${size} multiple choices`}
				/>
			</div>
		{/each}
	</Section>
	<Section {...sections[2]}>
		<PropTable {props} label="PillChoiceGroup props" />

		<p>
			Supply <code>aria-label</code>
			or
			<code>aria-labelledby</code>
			for the group name. A string selection uses native radio behavior; an array uses checkboxes. Tab
			and arrow keys navigate radios; Space toggles focused checkboxes.
		</p>
	</Section>
</Page>

<style>
	form,
	fieldset,
	[data-choice-demo] {
		display: grid;
		gap: 1rem;
	}
	fieldset {
		min-width: 0;
		border: 1px solid var(--docs-rule);
	}
	[data-controls] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}
	[data-controls] > label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	[data-background-toggle] {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	form {
		position: relative;
		isolation: isolate;
		padding: 1rem;
	}
	[data-choice-demo],
	[data-reset] {
		position: relative;
		z-index: 1;
	}
	p {
		margin: 0;
	}
	[data-control] {
		display: grid;
		gap: 0.5rem;
		width: min(100%, 12rem);
		min-width: 0;
	}
</style>
