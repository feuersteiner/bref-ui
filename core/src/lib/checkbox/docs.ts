import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'A compact checkbox with clear checked states and native form behavior.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { Checkbox } from 'bref-ui';
  let checked = $state(false);
</script>

<label><Checkbox bind:checked /> Accept terms</label>
\`\`\`

Wrap in a label or connect a label with for/id. Bind checked; pass indeterminate for a mixed state (not bindable). Native checkbox attributes, form submission, required, disabled and change/input events are preserved. Customize size; keep a visible keyboard focus indicator.`,
	props: [
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'Checkbox size from x-small through x-large.'
		},
		{
			name: 'checked',
			type: 'boolean',
			required: false,
			default: 'false',
			description:
				'Bind to the checked state. Checkmark motion respects reduced motion and does not delay removing a parent.',
			bindable: true
		}
	]
} satisfies ComponentDocProps;
