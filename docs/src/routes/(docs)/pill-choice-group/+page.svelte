<script lang="ts">
	import { componentDocs } from 'bref-ui/docs';
	import ComponentUsage from '../components/component-usage.svelte';
	/* eslint-disable max-lines -- Keep this page's controls, selection demos and documentation together. */
	import { chapter, sections } from './sections.js';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import DemoGroup from '../components/demo-group.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import type { Color, Size, Variant, PillDataProps } from 'bref-ui/types';
	import { Button, PillChoiceGroup, Select, Checkbox } from 'bref-ui';
	import PropTable from '../components/prop-table.svelte';
	import MovingBackground from '../components/moving-background.svelte';

	const doc = componentDocs['pill-choice-group'];
	const props = doc.props;

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
	let glass = $state(false);
	let deleteEnabled = $state(true);
	let previewItems = $state<PillDataProps[]>([...items]);
	let previewSelection = $state<string | string[]>('focus');
	let showIcons = $state(true);
	const renderedItems = $derived(
		previewItems.map((item) => ({ ...item, icon: showIcons ? item.icon : undefined }))
	);
	const deletePreviewItem = (id: string) => {
		previewItems = previewItems.filter((item) => item.id !== id);
		previewSelection = Array.isArray(previewSelection)
			? previewSelection.filter((selected) => selected !== id)
			: previewSelection === id
				? ''
				: previewSelection;
	};
	const reset = () => {
		size = 'medium';
		variant = 'neutral';
		color = 'foreground';
		disabled = false;
		animateSelected = false;
		glass = false;
		movingBackground = false;
		deleteEnabled = true;
		showIcons = true;
		previewItems = [...items];
		previewSelection = 'focus';
		moodItems = [...items];
		filterItems = [...items];
		mood = 'focus';
		filters = ['focus', 'calm'];
	};
	const playgroundSource = $derived(`<script lang="ts">
  import { PillChoiceGroup } from 'bref-ui';
  import type { PillDataProps } from 'bref-ui/types';
  let items = $state<PillDataProps[]>(${JSON.stringify(renderedItems, null, 2)});
  let selection = $state<string | string[]>(${JSON.stringify(previewSelection)});${deleteEnabled ? `\n  const remove = (id: string) => {\n    items = items.filter((item) => item.id !== id);\n    selection = Array.isArray(selection) ? selection.filter((selected) => selected !== id) : selection === id ? '' : selection;\n  };` : ''}
<${'/'}script>

<PillChoiceGroup {items} bind:selection aria-label="Interactive choices"
  size="${size}" variant="${variant}" color="${color}"
  disabled={${disabled}} glass={${glass}} animateSelected={${animateSelected}}${deleteEnabled ? '\n  onDelete={remove}' : ''} />
<p role="status">Selected: {Array.isArray(selection) ? selection.join(', ') || 'none' : selection || 'none'}</p>`);
</script>

<Page title={chapter} description={doc.description}>
	<Section {...sections[0]}>
		<PillChoiceGroup {items} selection="focus" aria-label="Example mood" />
		<ComponentUsage usage={doc.usage} />
	</Section>
	<Section {...sections[1]}>
		<Playground source={playgroundSource} onReset={reset}>
			{#snippet preview()}<div data-playground-stage>
					{#if movingBackground}<MovingBackground />{/if}
					<div data-playground-content>
						<PillChoiceGroup
							items={renderedItems}
							bind:selection={previewSelection}
							{size}
							{variant}
							{color}
							{glass}
							{disabled}
							{animateSelected}
							aria-label="Interactive choices"
							onDelete={deleteEnabled ? deletePreviewItem : undefined}
						/>
					</div>
				</div>{/snippet}
			{#snippet status()}<span role="status">
					Selected: {Array.isArray(previewSelection)
						? previewSelection.join(', ') || 'none'
						: previewSelection || 'none'}
				</span>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="pill-choice-group-size" label="Size">
					<Select
						id="pill-choice-group-size"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => size, (next) => (size = next as typeof size)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-choice-group-variant" label="Variant">
					<Select
						id="pill-choice-group-variant"
						items={variants.map((id) => ({ id, label: id }))}
						bind:value={() => variant, (next) => (variant = next as typeof variant)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-choice-group-color" label="Color">
					<Select
						id="pill-choice-group-color"
						items={colors.map((id) => ({ id, label: id }))}
						bind:value={() => color, (next) => (color = next as typeof color)}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-choice-group-glass" label="Glass" toggle>
					<Checkbox id="pill-choice-group-glass" bind:checked={glass} />
				</PlaygroundField>
				<PlaygroundField id="pill-choice-group-animateSelected" label="Animate selected" toggle>
					<Checkbox id="pill-choice-group-animateSelected" bind:checked={animateSelected} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Interaction">
				<PlaygroundField id="pill-choice-group-multiple" label="Multiple selection" toggle>
					<Checkbox
						id="pill-choice-group-multiple"
						checked={Array.isArray(previewSelection)}
						onchange={(event) => (previewSelection = event.currentTarget.checked ? [] : '')}
					/>
				</PlaygroundField>
				<PlaygroundField id="pill-choice-group-disabled" label="Disabled" toggle>
					<Checkbox id="pill-choice-group-disabled" bind:checked={disabled} />
				</PlaygroundField>
				<PlaygroundField id="pill-choice-group-deleteEnabled" label="Enable delete" toggle>
					<Checkbox id="pill-choice-group-deleteEnabled" bind:checked={deleteEnabled} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Preview">
				<PlaygroundField id="pill-choice-group-showIcons" label="Item icons" toggle>
					<Checkbox id="pill-choice-group-showIcons" bind:checked={showIcons} />
				</PlaygroundField>
				<PlaygroundField id="pill-choice-group-movingBackground" label="Moving background" toggle>
					<Checkbox id="pill-choice-group-movingBackground" bind:checked={movingBackground} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
		<DemoGroup title="Native selection and form reset">
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
						{glass}
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
						{glass}
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
						{glass}
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
		</DemoGroup>
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
			<DemoGroup title={variant}>
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
			</DemoGroup>
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

	form,
	[data-choice-demo] {
		display: grid;
		gap: 1rem;
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
</style>
