import type { ComponentDocProps } from '../types/docs.js';

export default {
	description:
		"Render Material Symbols by name, with inherited or explicit size and color, optional fill, and accessible labels. Load the Material Symbols font through Theme or your app's font-face declaration.",
	usage: `\`\`\`svelte
<script>
  import { Icon } from 'bref-ui';
</script>

<Icon name="check_circle" label="Complete" />
<Icon name="favorite" filled size="large" color="secondary" />
\`\`\`

Load Material Symbols through Theme or a font-face declaration before rendering icons. Omit label for decorative icons; provide label for meaningful standalone icons. Size and color inherit when omitted. Set filled for the filled glyph. Native span attributes are forwarded.`,
	props: [
		{
			name: 'name',
			type: 'IconName',
			required: true,
			default: '—',
			description: 'Material Symbols identifier.'
		},
		{
			name: 'filled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Use the filled glyph variant.'
		},
		{
			name: 'label',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Accessible name for a meaningful standalone icon.'
		},
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'Inherited',
			description: 'x-small, small, medium, large or x-large.'
		},
		{
			name: 'color',
			type: 'Color',
			required: false,
			default: 'Inherited',
			description:
				'primary, secondary, foreground, background, muted, info, success, warning or error.'
		}
	]
} satisfies ComponentDocProps;
