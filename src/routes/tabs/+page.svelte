<script lang="ts">
	/* eslint-disable max-lines -- Keep both orientations and their interactive examples together. */
	import { Button, Checkbox, Select, Tabs, TextInput } from '$lib/index.js';
	import type { Dimension, Orientation, TabItemDataProps, TabTransition } from '$lib/types.js';
	import { fade, fly } from 'svelte/transition';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import { chapter, sections } from './sections.js';

	const items: TabItemDataProps[] = [
		{ id: 'overview', label: 'Overview', icon: 'dashboard' },
		{ id: 'activity', label: 'Activity', icon: 'history' },
		{ id: 'archived', label: 'Archived', icon: 'archive', disabled: true },
		{ id: 'settings', label: 'Settings', icon: 'settings' }
	];
	let horizontal = $state('overview');
	let vertical = $state('overview');
	let previewValue = $state<string | undefined>('overview');
	let orientation = $state<Orientation>('horizontal');
	let size = $state<Dimension>('fit');
	let filled = $state(false);
	let customTransitions = $state(false);
	let label = $state('Preview sections');
	let empty = $state(false);
	let changes = $state(0);
	const previewItems = $derived(empty ? [] : items);
	const layout = $derived(orientation === 'horizontal' ? { orientation, size } : { orientation });
	const customIn: TabTransition = (node) => fly(node, { y: 6, duration: 150 });
	const customOut: TabTransition = (node) => fade(node, { duration: 100 });
	const selectedLabel = (id: string | undefined) =>
		items.find((item) => item.id === id)?.label ?? 'No tab selected';
	const source = (direction: Orientation) => `<script lang="ts">
  import { Tabs } from 'bref-ui';
  let value = $state('overview');
  const items = ${JSON.stringify(items, null, 2)} as const;
<${'/'}script>

<Tabs {items} bind:value orientation="${direction}" label="Workspace sections" />
{#if value === 'overview'}
  <p>Workspace overview</p>
{:else}
  <p>Workspace settings</p>
{/if}`;
	const playgroundSource = $derived(`<script lang="ts">
  import { Tabs } from 'bref-ui';${customTransitions ? "\n  import { fade, fly } from 'svelte/transition';" : ''}
  const items = ${JSON.stringify(previewItems, null, 2)} as const;
  let value = $state<string | undefined>(${JSON.stringify(previewValue) ?? 'undefined'});
  let changes = $state(0);
<${'/'}script>

<Tabs
  {items}
  bind:value
  orientation="${orientation}"${orientation === 'horizontal' ? `\n  size="${size}"` : ''}
  label={${JSON.stringify(label)}}
  filled={${filled}}${customTransitions ? '\n  transitionIn={(node) => fly(node, { y: 6, duration: 150 })}\n  transitionOut={(node) => fade(node, { duration: 100 })}' : ''}
  onChange={() => changes++}
/>
<p role="status">Selected: {value ?? 'none'}; changes: {changes}</p>`);
	const reset = () => {
		previewValue = 'overview';
		orientation = 'horizontal';
		size = 'fit';
		filled = false;
		customTransitions = false;
		label = 'Preview sections';
		empty = false;
		changes = 0;
	};
	const props = [
		{
			name: 'items',
			type: 'readonly TabItemDataProps[]',
			required: true,
			default: '—',
			description:
				'Display order; each item has a unique id, label, icon and optional disabled flag.'
		},
		{
			name: 'orientation',
			type: 'Orientation',
			required: false,
			default: 'horizontal',
			description:
				'Soft glass pills in a horizontal row or equal-width vertical column; determines arrow-key navigation.'
		},
		{
			name: 'size',
			type: 'Dimension',
			required: false,
			default: 'fit',
			description:
				'Horizontal only: fit keeps natural item widths and scrolls; fill spans the parent and truncates labels. Vertical rejects size.'
		},
		{
			name: 'value',
			type: 'string',
			required: false,
			default: 'undefined',
			description: 'Bindable selected ID. Omitted or unmatched IDs leave the strip unselected.'
		},
		{
			name: 'onChange',
			type: '(id: string) => void',
			required: false,
			default: 'Omitted',
			description: 'Called once when user interaction changes selection.'
		},
		{
			name: 'label',
			type: 'string',
			required: false,
			default: 'Tabs',
			description: 'Accessible name for the tab list.'
		},
		{
			name: 'filled',
			type: 'boolean',
			required: false,
			default: 'false',
			description:
				'Fill every Material Symbols icon; the selected icon is always filled. Does not change the soft glass background.'
		},
		{
			name: 'transitionIn',
			type: 'TabTransition',
			required: false,
			default: 'Shared crossfade',
			description: 'Custom intro for the selected indicator; receives its HTMLElement.'
		},
		{
			name: 'transitionOut',
			type: 'TabTransition',
			required: false,
			default: 'Shared crossfade',
			description: 'Custom outro for the selected indicator; receives its HTMLElement.'
		}
	];
</script>

<Page
	title={chapter}
	description="Switch between sections with primary-colored floating pills and soft glass selection, horizontally or vertically."
>
	<Section {...sections.find((section) => section.id === 'horizontal')!}>
		<div data-demo="horizontal">
			<div data-tabs>
				<Tabs {items} bind:value={horizontal} label="Horizontal workspace sections" />
			</div>
			<div data-content>
				<small>Workspace</small>
				<h3>{selectedLabel(horizontal)}</h3>
				<p>The selected section is rendered here by the consumer.</p>
			</div>
		</div>
		<details>
			<summary>Horizontal usage code</summary>
			<CodeSnippet source={source('horizontal')} label="Horizontal tabs code" />
		</details>
	</Section>
	<Section {...sections.find((section) => section.id === 'vertical')!}>
		<div data-demo="vertical">
			<div data-tabs>
				<Tabs
					{items}
					bind:value={vertical}
					orientation="vertical"
					label="Vertical workspace sections"
					filled
				/>
			</div>
			<div data-content>
				<small>Workspace</small>
				<h3>{selectedLabel(vertical)}</h3>
				<p>Filled icons, with content beside the strip.</p>
			</div>
		</div>
		<details>
			<summary>Vertical usage code</summary>
			<CodeSnippet
				source={source('vertical').replace(
					'label="Workspace sections"',
					'label="Workspace sections" filled'
				)}
				label="Vertical tabs code"
			/>
		</details>
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={reset}>
			{#snippet preview()}
				<div data-preview>
					<Tabs
						items={previewItems}
						bind:value={previewValue}
						{...layout}
						{label}
						{filled}
						transitionIn={customTransitions ? customIn : undefined}
						transitionOut={customTransitions ? customOut : undefined}
						onChange={() => changes++}
					/>
				</div>
			{/snippet}
			{#snippet status()}<p role="status">
					Selected: {previewValue ?? 'none'}; changes: {changes}
				</p>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="tabs-orientation" label="Orientation">
					<Select
						id="tabs-orientation"
						items={['horizontal', 'vertical'].map((id) => ({ id, label: id }))}
						bind:value={() => orientation, (next) => (orientation = next as Orientation)}
					/>
				</PlaygroundField>
				{#if orientation === 'horizontal'}
					<PlaygroundField id="tabs-size" label="Size">
						<Select
							id="tabs-size"
							items={['fit', 'fill'].map((id) => ({ id, label: id }))}
							bind:value={() => size, (next) => (size = next as Dimension)}
						/>
					</PlaygroundField>
				{/if}
				<PlaygroundField id="tabs-filled" label="Filled icons" toggle>
					<Checkbox id="tabs-filled" bind:checked={filled} />
				</PlaygroundField>
				<PlaygroundField id="tabs-transitions" label="Custom transitions" toggle>
					<Checkbox id="tabs-transitions" bind:checked={customTransitions} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Selection">
				<PlaygroundField id="tabs-label" label="Accessible name">
					<TextInput id="tabs-label" bind:value={label} />
				</PlaygroundField>
				<PlaygroundField id="tabs-empty" label="Empty items" toggle>
					<Checkbox id="tabs-empty" bind:checked={empty} />
				</PlaygroundField>
				<Button label="Clear selection" size="small" onClick={() => (previewValue = undefined)} />
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'states')!}>
		<h3>No initial selection</h3>
		<Tabs {items} label="Initially unselected sections" />
		<h3>All tabs disabled</h3>
		<Tabs items={items.map((item) => ({ ...item, disabled: true }))} label="Unavailable sections" />
		<h3>Long labels in a narrow container</h3>
		<div data-narrow>
			<p>Fit: natural widths with scrolling.</p>
			<Tabs
				items={items.map((item) => ({ ...item, label: `${item.label} and workspace preferences` }))}
				value="overview"
				label="Long workspace sections"
			/>
			<p>Fill: parent width with truncated labels.</p>
			<Tabs
				items={items.map((item) => ({ ...item, label: `${item.label} and workspace preferences` }))}
				value="overview"
				size="fill"
				label="Fill workspace sections"
			/>
			<p>Vertical: truncated labels with vertical scrolling.</p>
			<div data-vertical-scroll>
				<Tabs
					items={items.map((item) => ({
						...item,
						label: `${item.label} and workspace preferences`
					}))}
					value="overview"
					orientation="vertical"
					label="Long vertical workspace sections"
				/>
			</div>
		</div>
		<p>
			Horizontal tabs support fit and fill: fit keeps natural label widths and scrolls; fill spans
			the parent and truncates with ellipses. Vertical tabs always truncate overflowing labels and
			scroll vertically when height is constrained. At 575px and below, horizontal tabs show only
			the selected label and vertical tabs hide every label. Every tab requires an icon and keeps
			its full accessible name.
		</p>
		<p>
			Arrow keys follow the orientation, wrap and skip disabled tabs. Home and End select the first
			and last enabled tabs. Enter or Space selects the focused tab; Tab leaves the strip.
		</p>
	</Section>
	<Section {...sections.find((section) => section.id === 'props')!}>
		<PropTable {props} />
		<p>
			Only the tab strip is rendered. Content and navigation belong to the consumer; no snippets or
			native HTML attributes/events are forwarded. Use bind:value or onChange for selection. Icons
			are decorative; each item's label names its tab.
		</p>
		<p>
			Without a selected ID, enabled tabs keep native Tab order. A matching selected ID gives its
			tab the only Tab stop; unmatched or disabled IDs provide no enabled Tab stop. Empty and fully
			disabled strips have no Tab stop. The shared theme control switches light and dark modes.
		</p>
		<p>
			Custom transitions return a Svelte TransitionConfig or a function returning one. Use closures
			to supply parameters; omitted transitions use the shared crossfade.
		</p>
	</Section>
</Page>

<style>
	[data-demo] {
		min-width: 0;
		border: 1px solid var(--docs-rule-strong);
		border-radius: 0.75rem;
		background: var(--docs-surface);
	}
	[data-demo='vertical'] {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
	}
	[data-tabs] {
		min-width: 0;
		padding: 0.75rem;
	}
	[data-content] {
		min-width: 0;
		padding: 1.5rem;
	}
	[data-demo='horizontal'] [data-content] {
		border-block-start: 1px solid var(--docs-rule-strong);
	}
	[data-demo='vertical'] [data-content] {
		border-inline-start: 1px solid var(--docs-rule-strong);
	}
	[data-content] h3 {
		margin-block: 0.5rem;
		font-size: 1.5rem;
	}
	small {
		color: var(--color-muted);
	}
	[data-preview] {
		min-width: 0;
		width: 100%;
	}
	[data-narrow] {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1rem;
		width: min(100%, 20rem);
		min-width: 0;
	}
	[data-vertical-scroll] {
		height: 9rem;
		min-width: 0;
		min-height: 0;
	}
	details {
		min-width: 0;
	}
	summary {
		padding-block: 0.75rem;
		cursor: pointer;
	}
	summary:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (max-width: 575px) {
		[data-content] {
			padding: 1rem;
		}
		[data-demo='vertical'] {
			grid-template-columns: minmax(0, 1fr);
		}
		[data-demo='vertical'] [data-content] {
			border-inline-start: 0;
			border-block-start: 1px solid var(--docs-rule-strong);
		}
	}
</style>
