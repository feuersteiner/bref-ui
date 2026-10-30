import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'A native single-line text control with an optional leading icon.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { TextInput } from 'bref-ui';
</script>

<label>Name <TextInput name="name" placeholder="Your name" /></label>
\`\`\`

Wrap in a label or connect one with for/id. Bind value as a string, including number inputs. Native input attributes and events are forwarded; onChange receives the string once per edit. Use type, name, required, readonly and disabled as on an input. Customize size, variant, glass, wide and an optional decorative icon.`,
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
		}
	]
} satisfies ComponentDocProps;
