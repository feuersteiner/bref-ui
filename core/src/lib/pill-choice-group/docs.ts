import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'Single or multiple choices presented as a group of Pills.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { PillChoiceGroup } from 'bref-ui';
  let selection = $state('focus');
</script>

<PillChoiceGroup items={[{ id: 'focus', label: 'Focus' }, { id: 'calm', label: 'Calm' }]} bind:selection aria-label="Mood" />
\`\`\`

Bind selection to a string for single selection or an array for multiple selection. Provide unique item IDs and labels. Native radio/checkbox behavior provides keyboard selection; label the group with aria-label or aria-labelledby. onDelete receives an ID; update items and selection together. Customize size, variant, color, glass and animateSelected.`,
	props: [
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
			description: 'Bindable ID for radio choice, or IDs for checkboxes.',
			bindable: true
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
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'Pill size.'
		},
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
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Translucent paint and backdrop blur for the choices.'
		}
	]
} satisfies ComponentDocProps;
