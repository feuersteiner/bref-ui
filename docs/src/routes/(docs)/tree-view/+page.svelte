<script lang="ts">
	import { componentDocs } from 'bref-ui/docs';
	import ComponentUsage from '../components/component-usage.svelte';
	/* eslint-disable max-lines -- Keep live examples and their prop documentation together. */
	import { chapter, sections } from './sections.js';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import MovingBackground from '../components/moving-background.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Button, TreeView, Select, Checkbox, TextInput } from 'bref-ui';
	import type { BaseSize, TreeItemProps, TreeSectionProps } from 'bref-ui/types';

	const doc = componentDocs['tree-view'];
	const props = doc.props;

	const exampleItems: TreeItemProps[] = [
		{ id: 'projects', label: 'Projects', children: [{ id: 'notes', label: 'Notes' }] }
	];
	const initialSections: TreeSectionProps[] = [
		{
			id: 'workspace',
			label: 'Workspace',
			description: 'Projects and shared files',
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
	let glass = $state(false);
	let exampleSelection = $state<string>();
	let defaultExpanded = $state(true);
	let previewRevision = $state(0);
	let movingBackground = $state(false);
	let withSections = $state(true);
	let customNode = $state(false);
	let treeLabel = $state('Interactive files');
	const sizes = ['small', 'medium', 'large'] as const;
	const reset = () => {
		treeSections = initialSections;
		selection = 'tokens';
		size = 'medium';
		allowDelete = false;
		glass = false;
		defaultExpanded = true;
		movingBackground = false;
		withSections = true;
		customNode = false;
		treeLabel = 'Interactive files';
		previewRevision++;
	};
	const removeItem = (items: TreeItemProps[], id: string): TreeItemProps[] =>
		items
			.filter((item) => item.id !== id)
			.map((item) => ({ ...item, children: item.children && removeItem(item.children, id) }));
	const deleteItem = (id: string) => {
		treeSections = treeSections.map((section) => ({
			...section,
			items: removeItem(section.items, id)
		}));
		const selectedIds = Array.isArray(selection) ? selection : [selection];
		const collectIds = (items: TreeItemProps[]): string[] =>
			items.flatMap((item) => [item.id, ...collectIds(item.children ?? [])]);
		const remainingIds = treeSections.flatMap((section) => collectIds(section.items));
		const remainingSelection = selectedIds.filter((selected) => remainingIds.includes(selected));
		selection = Array.isArray(selection) ? remainingSelection : (remainingSelection[0] ?? '');
	};
	const previewItems = $derived(
		withSections ? [] : treeSections.flatMap((section) => section.items)
	);
	const playgroundSource = $derived(`<script lang="ts">
  import { TreeView } from 'bref-ui';
  import type { TreeItemProps, TreeSectionProps } from 'bref-ui/types';
  let items = $state<TreeItemProps[]>(${JSON.stringify(previewItems, null, 2)});
  let sections = $state<TreeSectionProps[]>(${JSON.stringify(withSections ? treeSections : [], null, 2)});
  let selection = $state<string | string[]>(${JSON.stringify(selection)});${
		allowDelete
			? `
  const removeItem = (items: TreeItemProps[], id: string): TreeItemProps[] => items.filter((item) => item.id !== id).map((item) => ({ ...item, children: item.children && removeItem(item.children, id) }));
  const collectIds = (items: TreeItemProps[]): string[] => items.flatMap((item) => [item.id, ...collectIds(item.children ?? [])]);
  const remove = (id: string) => {
    items = removeItem(items, id);
    sections = sections.map((section) => ({ ...section, items: removeItem(section.items, id) }));
    const ids = [...collectIds(items), ...sections.flatMap((section) => collectIds(section.items))];
    selection = Array.isArray(selection) ? selection.filter((selected) => ids.includes(selected)) : ids.includes(selection) ? selection : '';
  };`
			: ''
	}
<${'/'}script>

<TreeView {items} {sections} bind:selection label={${JSON.stringify(treeLabel)}}
  size="${size}" glass={${glass}} defaultExpanded={${defaultExpanded}}${allowDelete ? '\n  onDelete={remove}' : ''}${customNode ? '>\n  {#snippet node(item)}\n    <a href="#props">{item.label}</a>\n  {/snippet}\n</TreeView>' : ' />'}
<p role="status">Selected: {Array.isArray(selection) ? selection.join(', ') || 'none' : selection || 'none'}</p>`);
</script>

{#snippet linkNode(item: TreeItemProps)}<a href="#props">{item.label}</a>{/snippet}

<Page title={chapter} description={doc.description}>
	<Section {...sections[0]}>
		<TreeView items={exampleItems} label="Files" bind:selection={exampleSelection} />
		<ComponentUsage usage={doc.usage} />
	</Section>
	<Section {...sections[1]}>
		<p>
			Labels share an icon column, and each nesting level advances by the disclosure column.
			Selected rows use a quiet fill; touch controls receive larger targets.
		</p>
		<Playground source={playgroundSource} onReset={reset}>
			{#snippet preview()}<div data-playground-stage>
					{#if movingBackground}<MovingBackground />{/if}
					<div data-playground-content>
						{#key `${defaultExpanded}-${previewRevision}`}<TreeView
								items={previewItems}
								sections={withSections ? treeSections : []}
								label={treeLabel}
								{size}
								{glass}
								{defaultExpanded}
								bind:selection
								onDelete={allowDelete ? deleteItem : undefined}
								node={customNode ? linkNode : undefined}
							/>{/key}
					</div>
				</div>{/snippet}
			{#snippet status()}<span role="status">
					Selected: {Array.isArray(selection)
						? selection.join(', ') || 'none'
						: selection || 'none'}
				</span>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="tree-view-size" label="Size">
					<Select
						id="tree-view-size"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => size, (next) => (size = next as typeof size)}
					/>
				</PlaygroundField>
				<PlaygroundField id="tree-view-glass" label="Glass selection" toggle>
					<Checkbox id="tree-view-glass" bind:checked={glass} />
				</PlaygroundField>
				<PlaygroundField id="tree-view-movingBackground" label="Moving background" toggle>
					<Checkbox id="tree-view-movingBackground" bind:checked={movingBackground} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Content">
				<PlaygroundField id="tree-view-treeLabel" label="Accessible name">
					<TextInput id="tree-view-treeLabel" bind:value={treeLabel} />
				</PlaygroundField>
				<PlaygroundField id="tree-view-withSections" label="Section headers" toggle>
					<Checkbox id="tree-view-withSections" bind:checked={withSections} />
				</PlaygroundField>
				<PlaygroundField id="tree-view-customNode" label="Custom link nodes" toggle>
					<Checkbox id="tree-view-customNode" bind:checked={customNode} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Interaction">
				<PlaygroundField id="tree-view-multiple" label="Multiple selection" toggle>
					<Checkbox
						id="tree-view-multiple"
						checked={Array.isArray(selection)}
						onchange={(event) => (selection = event.currentTarget.checked ? [] : '')}
					/>
				</PlaygroundField>
				<PlaygroundField id="tree-view-defaultExpanded" label="Initially expanded" toggle>
					<Checkbox id="tree-view-defaultExpanded" bind:checked={defaultExpanded} />
				</PlaygroundField>
				<PlaygroundField id="tree-view-allowDelete" label="Enable delete" toggle>
					<Checkbox id="tree-view-allowDelete" bind:checked={allowDelete} />
				</PlaygroundField>
				<Button
					label="Select Tokens"
					size="small"
					onClick={() => (selection = Array.isArray(selection) ? ['tokens'] : 'tokens')}
				/>
			</PlaygroundGroup>
		</Playground>
		<p>
			Initially expanded remounts the preview because it sets each branch's initial state. Custom
			link nodes own their own interaction behavior.
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
		<p>An empty tree renders no rows. Custom node snippets own their styling and behavior.</p>
		<TreeView items={[{ id: 'props-link', label: 'Tree view props' }]} label="Custom links">
			{#snippet node(item)}
				<a href="#props">{item.label}</a>
			{/snippet}
		</TreeView>
	</Section>
	<Section {...sections[3]}><PropTable {props} /></Section>
	<Section {...sections[4]}>
		<p>
			Tab and Shift+Tab move between selection buttons, delete buttons and disclosures. Enter or
			Space activates the focused control. Disabled buttons are skipped. Each branch has a separate
			expand/collapse button; arrow keys retain browser behavior.
		</p>
		<p>
			The item label selects; the disclosure marker expands or collapses. An array enables
			independent multiple selection. Parent selection does not select descendants, and collapse
			preserves selection. The caller owns data removal and stale selected IDs.
		</p>
		<p>
			This component uses grouped native buttons by default. Focus follows browser behavior when
			items disappear. Selection is bindable; native attributes are not forwarded. Supply a
			<code>node</code>
			snippet to render custom links or rows; the snippet owns the entire node, including descendants
			and interaction behavior. The documentation sidebar uses this slot for native links and the selected
			page's sections.
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
