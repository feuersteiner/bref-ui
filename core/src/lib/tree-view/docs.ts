import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'Nested items with expandable branches and selectable rows.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { TreeView } from 'bref-ui';
  const items = [{
    id: 'projects', label: 'Projects',
    children: [{ id: 'notes', label: 'Notes' }]
  }];
  let selection = $state<string>();
</script>

<TreeView {items} label="Files" bind:selection />
\`\`\`

Provide nested items with unique IDs and labels; optional sections group roots. Bind selection to a string for single selection or an array for multiple selection. Use label for the accessible tree name. Use Tab to focus native buttons and Enter/Space to activate selection or expansion. onDelete receives an ID; update items to remove it. A node snippet customizes content. Customize size and glass; only the documented props are accepted.`,
	props: [
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
			description:
				'Ordered headers with id, label, optional description and icon, and their own items array.'
		},
		{
			name: 'label',
			type: 'string',
			required: false,
			default: 'Tree view',
			description: 'Accessible name for the group of items.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'small, medium or large.'
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Use glass on selected soft surfaces, including nested items.'
		},
		{
			name: 'selection',
			type: 'string | string[]',
			required: false,
			default: 'Omitted',
			description:
				'Bindable selected IDs. A string selects one item; an array toggles individual items independently.',
			bindable: true
		},
		{
			name: 'defaultExpanded',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Sets the initial open state of each branch.'
		},
		{
			name: 'onDelete',
			type: '(id: string) => void',
			required: false,
			default: 'Omitted',
			description:
				'Shows a delete button for each item; the caller updates the nested data and selection.'
		},
		{
			name: 'node',
			type: 'Snippet<[TreeItemProps]>',
			required: false,
			default: 'Omitted',
			description:
				'Replaces each top-level node in items and sections. The snippet owns its links, children, expansion, selection and actions.'
		}
	]
} satisfies ComponentDocProps;
