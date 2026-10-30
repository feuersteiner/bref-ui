import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'A compact glass label for status, categories and optional actions.',
	usage: `\`\`\`svelte
<script>
  import { Pill } from 'bref-ui';
</script>

<Pill label="Glass" color="primary" glass />
\`\`\`

Use label for visible text and an optional icon for decoration. onClick makes the label actionable; onDelete adds a separately named remove control. Children replace the label content. Customize size, variant, color, glass and wide. Native container attributes are forwarded; use explicit accessible labels for icon actions.`,
	props: [
		{
			name: 'label',
			type: 'string',
			required: true,
			default: '—',
			description: 'Visible label.'
		},
		{
			name: 'icon',
			type: "Omit<IconProps, 'label' | 'size' | 'color'>",
			required: false,
			default: 'Omitted',
			description: 'Decorative leading icon.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: false,
			default: 'Omitted',
			description: 'Visible content.'
		},
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'Five sizes from x-small to x-large.'
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
			description: 'Theme role.'
		},
		{
			name: 'onClick',
			type: '(event: MouseEvent) => void',
			required: false,
			default: 'Omitted',
			description: 'Activate the Pill.'
		},
		{
			name: 'onDelete',
			type: '() => void',
			required: false,
			default: 'Omitted',
			description: 'Show a labeled remove button.'
		},
		{
			name: 'wide',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Fill the available width.'
		},
		{
			name: 'swoosh',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Animate the highlight.'
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Translucent paint and backdrop blur.'
		}
	]
} satisfies ComponentDocProps;
