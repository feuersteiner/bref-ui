import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'A list of Pills for related categories or statuses.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { PillGroup } from 'bref-ui';
</script>

<PillGroup items={[{ id: "draft", label: "Draft" }]} aria-label="Status" />
\`\`\`

Provide items with stable unique IDs and visible labels. onDelete receives the item ID; update items to remove it. Native list attributes are forwarded. Customize size, variant, color and glass; keep labels readable at narrow widths.`,
	props: [
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
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'Pill size.'
		},
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
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Translucent paint and backdrop blur for every Pill.'
		}
	]
} satisfies ComponentDocProps;
