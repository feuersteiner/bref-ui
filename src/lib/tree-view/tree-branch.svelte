<script module lang="ts">
	/* eslint-disable svelte/prefer-svelte-reactivity -- Build immutable index snapshots inside the parent derived value. */
	import type { TreeItemProps } from './tree-node.svelte';
	export type TreeSectionProps = Pick<TreeItemProps, 'id' | 'label' | 'icon'>;

	export interface VisibleItem {
		item: TreeItemProps;
		parentId?: string;
		level: number;
	}

	export interface TreeIndex {
		items: Map<string, TreeItemProps>;
		children: Map<string, TreeItemProps[]>;
		sections: (TreeSectionProps | undefined)[];
	}

	const rootKey = (sectionId?: string) => `root:${JSON.stringify(sectionId)}`;
	const childKey = (id: string) => `child:${id}`;

	export const indexTree = (
		items: TreeItemProps[],
		sections: TreeSectionProps[] = []
	): TreeIndex => {
		const indexed = new Map<string, TreeItemProps>();
		const children = new Map<string, TreeItemProps[]>();
		const sectionIds = new Set<string>();
		for (const section of sections) {
			if (sectionIds.has(section.id))
				throw new Error(`TreeView section ID is duplicated: ${section.id}`);
			sectionIds.add(section.id);
		}
		for (const item of items) {
			if (indexed.has(item.id)) throw new Error(`TreeView item ID is duplicated: ${item.id}`);
			if (item.sectionId !== undefined && !sectionIds.has(item.sectionId))
				throw new Error(`TreeView item ${item.id} has an unknown section: ${item.sectionId}`);
			indexed.set(item.id, item);
		}
		for (const item of items) {
			if (item.parentId !== undefined) {
				const parent = indexed.get(item.parentId);
				if (!parent)
					throw new Error(`TreeView item ${item.id} has an unknown parent: ${item.parentId}`);
				if (parent.sectionId !== item.sectionId)
					throw new Error(`TreeView item ${item.id} crosses a section boundary`);
			}
			const key = item.parentId === undefined ? rootKey(item.sectionId) : childKey(item.parentId);
			const siblings = children.get(key) ?? [];
			siblings.push(item);
			children.set(key, siblings);
		}
		const done = new Set<string>();
		for (const item of items) {
			const visiting = new Set<string>();
			let cursor: TreeItemProps | undefined = item;
			while (cursor && !done.has(cursor.id)) {
				if (visiting.has(cursor.id)) throw new Error('TreeView items contain a cycle');
				visiting.add(cursor.id);
				cursor = cursor.parentId === undefined ? undefined : indexed.get(cursor.parentId);
			}
			for (const id of visiting) done.add(id);
		}
		return { items: indexed, children, sections: [undefined, ...sections] };
	};

	export const rootsFor = (index: TreeIndex, sectionId?: string) =>
		index.children.get(rootKey(sectionId)) ?? [];

	export const childrenFor = (index: TreeIndex, id: string) =>
		index.children.get(childKey(id)) ?? [];

	export const visibleItems = (
		index: TreeIndex,
		expanded: Record<string, boolean>,
		defaultExpanded: boolean
	): VisibleItem[] => {
		const result: VisibleItem[] = [];
		const visit = (nodes: TreeItemProps[], parentId: string | undefined, level: number) => {
			for (const item of nodes) {
				result.push({ item, parentId, level });
				if (childrenFor(index, item.id).length && (expanded[item.id] ?? defaultExpanded))
					visit(childrenFor(index, item.id), item.id, level + 1);
			}
		};
		for (const section of index.sections) visit(rootsFor(index, section?.id), undefined, 1);
		return result;
	};

	export const revealSelection = (
		index: TreeIndex,
		expanded: Record<string, boolean>,
		previous: readonly string[],
		selected: readonly string[]
	): Record<string, boolean> => {
		const existing = new Set(previous);
		let result = expanded;
		for (const id of selected) {
			if (existing.has(id)) continue;
			let parentId = index.items.get(id)?.parentId;
			while (parentId !== undefined) {
				if (result[parentId] !== true) {
					if (result === expanded) result = { ...expanded };
					result[parentId] = true;
				}
				parentId = index.items.get(parentId)?.parentId;
			}
		}
		return result;
	};
</script>

<script lang="ts">
	/* eslint-disable max-lines -- Hierarchy helpers and section rendering share the same source. */
	import Icon from '../icon/icon.svelte';
	import TreeNode from './tree-node.svelte';
	let {
		indexed,
		visible,
		expanded,
		initialExpanded,
		selected,
		activeId,
		onFocus,
		onSelect,
		onToggle,
		onDelete,
		focus
	}: {
		indexed: TreeIndex;
		visible: VisibleItem[];
		expanded: Record<string, boolean>;
		initialExpanded: boolean;
		selected: string[];
		activeId?: string;
		onFocus: (id: string) => void;
		onSelect: (id: string) => void;
		onToggle: (id: string) => void;
		onDelete?: (id: string) => void;
		focus: (id: string) => void;
	} = $props();
</script>

{#snippet renderNode(node: TreeItemProps, level: number)}
	{@const siblings =
		node.parentId === undefined
			? rootsFor(indexed, node.sectionId)
			: childrenFor(indexed, node.parentId)}
	<TreeNode
		{node}
		{level}
		position={siblings.indexOf(node) + 1}
		siblingCount={siblings.length}
		hasChildren={childrenFor(indexed, node.id).length > 0}
		open={expanded[node.id] ?? initialExpanded}
		selected={selected.includes(node.id)}
		{activeId}
		{onFocus}
		{onSelect}
		{onToggle}
		{onDelete}
		{focus}
	/>
{/snippet}
{#each indexed.sections as section (section?.id ?? '')}
	{#if section}
		<div role="group" aria-label={section.label} data-section-group>
			<div data-section role="presentation">
				{#if section.icon}<Icon {...section.icon} label={undefined} />{/if}
				<span>{section.label}</span>
			</div>
			{#each visible.filter(({ item }) => item.sectionId === section.id) as entry (entry.item.id)}
				{@render renderNode(entry.item, entry.level - 1)}
			{/each}
		</div>
	{:else}
		{#each visible.filter(({ item }) => item.sectionId === undefined) as entry (entry.item.id)}
			{@render renderNode(entry.item, entry.level - 1)}
		{/each}
	{/if}
{/each}

<style>
	[data-section-group] {
		display: grid;
		gap: 0.375rem;
		min-width: 0;
	}
	[data-section] {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 0.5rem 0.25rem;
		color: var(--color-muted);
		font-size: 0.8em;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
</style>
