<script lang="ts">
	/* eslint-disable max-lines -- Live states and prop documentation stay on the component page. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { TreeView } from '$lib/index.js';
	import type { BaseSize, TreeItem } from '$lib/types.js';

	const items: TreeItem[] = [
		{ id: 'overview', label: 'Overview' },
		{
			id: 'projects',
			label: 'Projects',
			children: [
				{
					id: 'design',
					label: 'Design',
					children: [
						{ id: 'tokens', label: 'Tokens' },
						{ id: 'components', label: 'Components' }
					]
				},
				{
					id: 'archive',
					label: 'Archive',
					disabled: true,
					children: [{ id: 'past-work', label: 'Past work' }]
				}
			]
		},
		{ id: 'settings', label: 'Settings' }
	];
	let selectedIds = $state<string[]>(['tokens']);
	let expandedIds = $state<string[]>(['projects', 'design']);
	let selection = $state<'single' | 'multiple'>('single');
	let size = $state<BaseSize>('medium');
	let showDesign = $state(true);
	const shownItems = $derived(
		showDesign
			? items
			: items.map((node) =>
					node.id === 'projects'
						? { ...node, children: node.children?.filter((child) => child.id !== 'design') }
						: node
				)
	);
	const source = `<script lang="ts">
	  import { TreeView } from 'bref-ui';
  let selectedIds = $state<string[]>([]);
  let expandedIds = $state<string[]>([]);
<${'/'}script>

<TreeView items={items} aria-label="Files" bind:selectedIds bind:expandedIds />`;
	const props = [
		{
			name: 'items',
			type: 'readonly TreeItem[]',
			required: true,
			default: '—',
			description: 'Unique IDs and labels, with optional children and disabled state.'
		},
		{
			name: 'aria-label / aria-labelledby',
			type: 'string',
			required: true,
			default: '—',
			description: 'Give the tree an accessible native name.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'small, medium or large.'
		},
		{
			name: 'selection',
			type: "'single' | 'multiple'",
			required: false,
			default: 'single',
			description: 'Choose one item or toggle several items.'
		},
		{
			name: 'selectedIds',
			type: 'string[]',
			required: false,
			default: '[]',
			description: 'Bindable selected IDs; unknown IDs are discarded.'
		},
		{
			name: 'expandedIds',
			type: 'string[]',
			required: false,
			default: '[]',
			description: 'Bindable expanded parent IDs.'
		},
		{
			name: 'item',
			type: 'Snippet<[TreeItem]>',
			required: false,
			default: 'Omitted',
			description: 'Decorative content after each label; no interactive controls.'
		},
		{
			name: 'ref',
			type: 'HTMLDivElement',
			required: false,
			default: 'Omitted',
			description: 'Bindable tree element.'
		}
	];
</script>

<Page
	title={chapter}
	description="A labeled hierarchy with controlled expansion, selection and keyboard navigation."
>
	<Section {...sections[0]}>
		<TreeView {items} aria-label="Files" bind:selectedIds bind:expandedIds />
		<CodeSnippet {source} label="Tree view usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-demo="controls">
			<label>
				Size <select bind:value={size}>
					<option>small</option>
					<option>medium</option>
					<option>large</option>
				</select>
			</label>
			<label>
				Selection <select bind:value={selection}>
					<option>single</option>
					<option>multiple</option>
				</select>
			</label>
			<label>
				<input type="checkbox" bind:checked={showDesign} />
				Include Design branch
			</label>
		</div>
		<TreeView
			items={shownItems}
			aria-label="Interactive files"
			{size}
			{selection}
			bind:selectedIds
			bind:expandedIds
		>
			{#snippet item(node)}<span data-kind>
					{node.children?.length ? 'Folder' : 'File'}
				</span>{/snippet}
		</TreeView>
		<p>
			Selected: {selectedIds.join(', ') || 'none'} · Expanded: {expandedIds.join(', ') || 'none'}
		</p>
	</Section>
	<Section {...sections[2]}>
		<p>Disabled Archive can take focus and expand. Its child remains selectable.</p>
		<TreeView
			{items}
			aria-label="Nested example"
			expandedIds={['projects', 'archive']}
			selectedIds={['past-work']}
		/>
		<TreeView items={[]} aria-label="Empty files" />
	</Section>
	<Section {...sections[3]}><PropTable {props} /></Section>
	<Section {...sections[4]}>
		<p>
			Tab enters on the selected item, or the first visible item. Arrow keys move focus and expand
			or collapse; Home and End reach the extremes. Typing finds matching labels. Enter and Space
			select; in multiple mode both toggle. Focus and selection stay separate.
		</p>
		<p>
			Click a row to select it, or its disclosure glyph to expand it. Native div attributes and
			events forward to the tree. Bind <code>selectedIds</code>
			,
			<code>expandedIds</code>
			and
			<code>ref</code>
			as needed. Item snippets are decorative; each item’s label is its accessible name.
		</p>
	</Section>
</Page>

<style>
	[data-demo='controls'] {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-block: 1rem;
	}
	label {
		display: grid;
		gap: 0.35rem;
	}
	label:has(input) {
		display: flex;
		align-items: center;
	}
	[data-kind] {
		color: var(--color-muted);
		font-size: 0.8em;
		margin-inline-start: 0.5rem;
	}
	:global([role='tree']) {
		max-width: 32rem;
	}
</style>
