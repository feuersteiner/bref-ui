import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'Choose one or more labeled options by ID.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { Select } from 'bref-ui';
  let status = $state<string | undefined>();
  const items = [{ id: 'draft', label: 'Draft' }];
</script>

<label for="status">Status</label>
<Select id="status" {items} bind:value={status} />
\`\`\`

Selected values are option IDs: bind a string for single selection or an array for multiple selection. Provide unique item IDs and visible labels; option icons and disabled states are optional. Give the trigger an accessible name through its placeholder. Use Tab to focus native option buttons, Enter/Space to select and Escape to close. Customize size, placeholder and emptyMessage. Select accepts only the documented props; use Combobox for searchable native form integration.`,
	props: [
		{
			name: 'items',
			type: 'readonly SelectOptionDataProps[]',
			required: true,
			default: '—',
			description: 'Unique IDs, labels, optional icons and disabled state.'
		},
		{
			name: 'value',
			type: 'string | string[]',
			required: false,
			default: 'undefined',
			description: 'Bindable selected ID or IDs; an array enables multiple selection.',
			bindable: true
		},
		{
			name: 'onChange',
			type: '(value: string | string[]) => void',
			required: false,
			default: 'Omitted',
			description: 'Called when a user changes selection.'
		},
		{
			name: 'id',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Trigger ID for label association.'
		},
		{
			name: 'placeholder',
			type: 'string',
			required: false,
			default: 'Select…',
			description: 'Text shown for an empty selection.'
		},
		{
			name: 'emptyMessage',
			type: 'SelectEmptyProps',
			required: false,
			default: "{ message: 'No options found' }",
			description: 'Empty results text and optional decorative icon.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Control and option size.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disable the control and close the popup.'
		}
	]
} satisfies ComponentDocProps;
