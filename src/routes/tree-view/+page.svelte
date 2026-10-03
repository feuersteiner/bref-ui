<script module lang="ts">
	export const chapter = 'Tree view';

	export const sections = [
		{ id: 'example', title: 'Usage' },
		{ id: 'playground', title: 'Selection and expansion' },
		{ id: 'states', title: 'Nested, disabled and empty states' },
		{ id: 'props', title: 'Props' },
		{ id: 'accessibility', title: 'Keyboard and accessibility' }
	] as const;
</script>

<script lang="ts">
	/* eslint-disable max-lines -- Gallery states and prop documentation stay together. */
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Button, TreeView } from '$lib/index.js';
	import type { BaseSize } from '$lib/types.js';
	import type { TreeItemProps, TreeSectionProps } from '$lib/types.js';

	const treeSections: TreeSectionProps[] = [
		{ id: 'workspace', label: 'Workspace', icon: { name: 'folder' } },
		{ id: 'personal', label: 'Personal', icon: { name: 'home' } }
	];
	let items = $state<TreeItemProps[]>([
		{ id: 'overview', label: 'Overview', icon: { name: 'home' } },
		{ id: 'projects', label: 'Projects', sectionId: 'workspace', icon: { name: 'folder' } },
		{
			id: 'design',
			label: 'Design',
			parentId: 'projects',
			sectionId: 'workspace',
			icon: { name: 'folder' }
		},
		{ id: 'tokens', label: 'Tokens', parentId: 'design', sectionId: 'workspace' },
		{ id: 'components', label: 'Components', parentId: 'design', sectionId: 'workspace' },
		{
			id: 'archive',
			label: 'Archive',
			parentId: 'projects',
			sectionId: 'workspace',
			disabled: true
		},
		{ id: 'past-work', label: 'Past work', parentId: 'archive', sectionId: 'workspace' },
		{ id: 'settings', label: 'Settings', sectionId: 'personal', icon: { name: 'settings' } }
	]);
	let selection = $state<string | string[]>('tokens');
	let size = $state<BaseSize>('medium');
	let showDesign = $state(true);
	let allowDelete = $state(false);
	const shownItems = $derived(
		showDesign
			? items
			: items.filter((item) => !['design', 'tokens', 'components'].includes(item.id))
	);
	const source = `<script lang="ts">
  import { TreeView } from 'bref-ui';
  const treeSections = [{ id: 'workspace', label: 'Workspace' }];
  const items = [{ id: 'projects', label: 'Projects', sectionId: 'workspace' }];
  let selection = $state<string>('projects');
<${'/'}script>

<TreeView items={items} sections={treeSections} label="Files" bind:selection />`;
	const props = [
		{
			name: 'items',
			type: 'TreeItemProps[]',
			required: true,
			default: '—',
			description:
				'Flat items with unique IDs; parentId and sectionId define hierarchy and membership.'
		},
		{
			name: 'sections',
			type: 'TreeSectionProps[]',
			required: false,
			default: '[]',
			description: 'Ordered, nonselectable section headers with id, label and optional icon.'
		},
		{
			name: 'label',
			type: 'string',
			required: false,
			default: 'Tree view',
			description: 'Accessible name for the tree.'
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
				'Bindable selection of individual nodes; an array enables multiple selection. New selections reveal their ancestors.'
		},
		{
			name: 'defaultExpanded',
			type: 'boolean',
			required: false,
			default: 'false',
			description:
				'Initial branch expansion. Selected ancestors are revealed; manual collapse persists until a new selection needs that path.'
		},
		{
			name: 'onDelete',
			type: '(id: string) => void',
			required: false,
			default: 'Omitted',
			description: 'Shows delete actions; the caller updates items and decides descendant policy.'
		}
	];

	const deleteItem = (id: string) => {
		const removed = [id];
		let changed = true;
		while (changed) {
			changed = false;
			for (const item of items)
				if (item.parentId && removed.includes(item.parentId) && !removed.includes(item.id)) {
					removed.push(item.id);
					changed = true;
				}
		}
		items = items.filter((item) => !removed.includes(item.id));
	};
</script>

<Page
	title={chapter}
	description="A labeled hierarchy with flat item data, sections, private expansion and keyboard navigation."
>
	<Section {...sections[0]}>
		<TreeView {items} sections={treeSections} label="Files" bind:selection />
		<CodeSnippet {source} label="Tree view usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-demo="controls">
			<label>
				Size
				<select bind:value={size}>
					<option>small</option>
					<option>medium</option>
					<option>large</option>
				</select>
			</label>
			<label>
				Selection shape
				<select
					value={Array.isArray(selection) ? 'multiple' : 'single'}
					onchange={(event) =>
						(selection =
							event.currentTarget.value === 'multiple'
								? typeof selection === 'string'
									? [selection]
									: selection
								: Array.isArray(selection)
									? (selection[0] ?? '')
									: selection)}
				>
					<option value="single">Single</option>
					<option value="multiple">Multiple</option>
				</select>
			</label>
			<label>
				<input type="checkbox" bind:checked={showDesign} />
				Include Design branch
			</label>
			<label>
				<input type="checkbox" bind:checked={allowDelete} />
				Enable delete action
			</label>
			<Button
				label="Select Projects"
				size="small"
				variant="soft"
				onClick={() => (selection = Array.isArray(selection) ? ['projects'] : 'projects')}
			/>
			<Button
				label="Select Tokens"
				size="small"
				variant="soft"
				onClick={() => (selection = Array.isArray(selection) ? ['tokens'] : 'tokens')}
			/>
		</div>
		<TreeView
			items={shownItems}
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
			Rows select individual nodes; chevrons only expand or collapse. Collapse preserves selection.
			Select Projects, collapse it, then Select Tokens to reveal the selected item's ancestors.
		</p>
	</Section>
	<Section {...sections[2]}>
		<p>Disabled Archive can take focus and expand. Its child remains selectable.</p>
		<TreeView
			{items}
			sections={treeSections}
			label="Expanded example"
			defaultExpanded
			selection="past-work"
		/>
		<TreeView items={[]} label="Empty files" />
	</Section>
	<Section {...sections[3]}><PropTable {props} /></Section>
	<Section {...sections[4]}>
		<p>
			Tab enters on the selected item or first visible item. Arrow keys move focus and expand or
			collapse; Home and End reach the extremes. Typing finds matching labels. Enter and Space
			select. In multiple selection, Space or a row click toggles only that node. Focus, selection
			and expansion remain separate; parent selection does not select descendants.
		</p>
		<p>
			Click a row to select or its chevron to expand. Bind <code>selection</code>
			to a string for one item or an array for several. Initial and newly selected items reveal their
			ancestors without opening the selected item's own children. Manual collapse does not clear selection
			or immediately reopen the branch. Sections are headers; every sectioned item states its own sectionId.
			When onDelete is supplied, Delete or a row action calls it with the item ID. The caller updates
			items.
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
	:global([role='tree']) {
		max-width: 32rem;
	}
</style>
