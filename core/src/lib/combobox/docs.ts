import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'Search local option labels while selected IDs stay separate from the query.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { Combobox } from 'bref-ui';
  let fruit = $state<string | undefined>(); const items = [{ id: 'apple', label: 'Apple' }];
</script>

<Combobox aria-label="Fruit" {items} bind:value={fruit} name="fruit" />
\`\`\`

Selected IDs remain separate from the editable search query. Bind a string for single selection or an array for multiple selection. Label with aria-label or aria-labelledby. Arrow keys move through results, Enter selects, Escape closes and restores selection. Native attributes are limited to the documented ComboboxNativeProps subset; name/form/required participate in forms and reset. Customize size, variant, wide, placeholder and emptyMessage.`,
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
			default: 'Generated',
			description: 'Input ID for label association.'
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
		},
		{
			name: 'variant',
			type: "Exclude<Variant, 'filled'>",
			required: false,
			default: 'soft',
			description: 'Neutral or soft input appearance.'
		},
		{
			name: 'wide',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Fill the available input width.'
		}
	]
} satisfies ComponentDocProps;
