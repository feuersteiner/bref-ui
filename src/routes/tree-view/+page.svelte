<script lang="ts">
	/* eslint-disable max-lines -- Keep live examples and their prop documentation together. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Button, TreeView } from '$lib/index.js';
	import type { BaseSize, TreeItemProps, TreeSectionProps } from '$lib/types.js';

	const exampleItems: TreeItemProps[] = [
		{ id: 'projects', label: 'Projects', children: [{ id: 'notes', label: 'Notes' }] }
	];
	const initialSections: TreeSectionProps[] = [
		{
			id: 'workspace',
			label: 'Workspace',
			icon: { name: 'folder' },
			items: [
				{
					id: 'projects',
					label: 'Projects',
					icon: { name: 'folder' },
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
				}
			]
		},
		{
			id: 'personal',
			label: 'Personal',
			icon: { name: 'home' },
			items: [{ id: 'settings', label: 'Settings', icon: { name: 'settings' } }]
		}
	];
	let treeSections = $state(initialSections);
	let selection = $state<string | string[]>('tokens');
	let size = $state<BaseSize>('medium');
	let allowDelete = $state(false);
	let exampleSelection = $state<string>();
	const removeItem = (items: TreeItemProps[], id: string): TreeItemProps[] =>
		items
			.filter((item) => item.id !== id)
			.map((item) => ({ ...item, children: item.children && removeItem(item.children, id) }));
	const deleteItem = (id: string) => {
		treeSections = treeSections.map((section) => ({
			...section,
			items: removeItem(section.items, id)
		}));
	};
	const source = `<script lang="ts">
  import { TreeView } from 'bref-ui';
  const items = [{
    id: 'projects', label: 'Projects',
    children: [{ id: 'notes', label: 'Notes' }]
  }];
  let selection = $state<string>();
<${'/'}script>

<TreeView {items} label="Files" bind:selection />`;
	const props = [
		{
			name: 'items',
			type: 'TreeItemProps[]',
			required: true,
			default: '—',
			description:
				'Nested items with id, label, optional icon, children and disabled. IDs must be unique across the component.'
		},
		{
			name: 'sections',
			type: 'TreeSectionProps[]',
			required: false,
			default: '[]',
			description: 'Ordered headers with id, label, optional icon and their own items array.'
		},
		{
			name: 'label',
			type: 'string',
			required: false,
			default: 'Tree view',
			description: 'Accessible name for the group of lists.'
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
			type: 'string | string[]',
			required: false,
			default: 'Omitted',
			description:
				'Bindable selected IDs. A string selects one item; an array toggles individual items independently.'
		},
		{
			name: 'defaultExpanded',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Opens branches when rendered. Changing this prop updates their open state.'
		},
		{
			name: 'onDelete',
			type: '(id: string) => void',
			required: false,
			default: 'Omitted',
			description:
				'Shows a delete button for each item; the caller updates the nested data and selection.'
		}
	];
</script>

<Page title={chapter} description="Nested lists with native disclosures and selectable items.">
	<Section {...sections[0]}>
		<TreeView items={exampleItems} label="Files" bind:selection={exampleSelection} />
		<CodeSnippet {source} label="Tree view usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-controls>
			<label>
				Size
				<select bind:value={size}>
					<option>small</option>
					<option>medium</option>
					<option>large</option>
				</select>
			</label>
			<label>
				Multiple selection
				<input
					type="checkbox"
					checked={Array.isArray(selection)}
					onchange={(event) => (selection = event.currentTarget.checked ? [] : '')}
				/>
			</label>
			<label>
				Enable delete action
				<input type="checkbox" bind:checked={allowDelete} />
			</label>
			<Button
				label="Select Tokens"
				size="small"
				onClick={() => (selection = Array.isArray(selection) ? ['tokens'] : 'tokens')}
			/>
			<Button label="Reset items" size="small" onClick={() => (treeSections = initialSections)} />
		</div>
		<TreeView
			items={[]}
			sections={treeSections}
			label="Interactive files"
			{size}
			defaultExpanded
			bind:selection
			onDelete={allowDelete ? deleteItem : undefined}
		/>
		<p>
			Selected: {Array.isArray(selection) ? selection.join(', ') || 'none' : selection || 'none'}
		</p>
		<p>
			Selecting an item does not expand its ancestors. Collapse Projects, then select Tokens to
			check that the branch stays closed.
		</p>
	</Section>
	<Section {...sections[2]}>
		<p>
			Disabled Archive cannot be selected or deleted. Its disclosure remains available, and its
			child can be selected.
		</p>
		<TreeView
			items={[
				{
					id: 'archive',
					label: 'Archive',
					disabled: true,
					children: [{ id: 'past-work', label: 'Past work' }]
				},
				{
					id: 'long',
					label:
						'A long item label that wraps naturally on narrow screens without hiding the item name'
				}
			]}
			label="Disabled and long items"
			defaultExpanded
		/>
		<TreeView items={[]} label="Empty files" />
	</Section>
	<Section {...sections[3]}><PropTable {props} /></Section>
	<Section {...sections[4]}>
		<p>
			Tab and Shift+Tab move between selection buttons, delete buttons and disclosures. Enter or
			Space activates the focused control. Disabled buttons are skipped. Each branch uses native
			details and summary elements; arrow keys retain browser behavior.
		</p>
		<p>
			The item label selects; the disclosure marker expands or collapses. An array enables
			independent multiple selection. Parent selection does not select descendants, and collapse
			preserves selection. The caller owns data removal and stale selected IDs.
		</p>
		<p>
			This component uses ordinary lists and buttons. Focus follows browser behavior when items
			disappear. Selection is bindable; there are no item snippets or forwarded native attributes.
		</p>
	</Section>
</Page>

<style>
	[data-controls] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin-block: 1rem;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
