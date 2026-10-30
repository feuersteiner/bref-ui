import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'A native multiline text control with an optional leading icon.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { TextArea } from 'bref-ui';
</script>

<label>Message <TextArea name="message" rows={3} /></label>
\`\`\`

Wrap in a label or connect one with for/id. Bind value as a string. Native textarea attributes and events, including rows, name, required, readonly and disabled, are forwarded. onChange receives each edited value. Customize size, variant, glass, wide and the decorative leading icon.`,
	props: [
		{
			name: 'value',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Bindable string value.',
			bindable: true
		},
		{
			name: 'onChange',
			type: '(value: string) => void',
			required: false,
			default: 'Omitted',
			description: 'Called once per input edit.'
		},
		{
			name: 'icon',
			type: 'IconProps',
			required: false,
			default: 'Omitted',
			description: 'Decorative leading icon.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Small, medium or large.'
		},
		{
			name: 'variant',
			type: "Exclude<Variant, 'filled'>",
			required: false,
			default: 'soft',
			description: 'Neutral or soft surface treatment.'
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Translucent surface with backdrop blur.'
		},
		{
			name: 'wide',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Fills available width.'
		},
		{
			name: 'resizable',
			type: 'boolean',
			required: false,
			default: 'true',
			description: 'Allows vertical resizing.'
		}
	]
} satisfies ComponentDocProps;
