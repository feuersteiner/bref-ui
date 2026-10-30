import type { ComponentDocProps } from '../types/docs.js';

export default {
	description:
		'An action or navigation control with text or icon labels, theme colors, five sizes, three variants, and wide, rounded or disabled options.',
	usage: `\`\`\`svelte
<script>
  import { Button } from 'bref-ui';
</script>

<Button label="Save" onClick={() => undefined} />
<Button label="Next" href="/next" color="primary" variant="filled" trailingIcon={{ name: 'arrow_forward' }} />
<Button icon={{ name: 'favorite', filled: true }} rounded onClick={() => undefined} aria-label="Favorite" />
<Button label="Unavailable" disabled />
\`\`\`

Use href for navigation and onClick for actions. Other native button/anchor attributes and events are forwarded, except onclick and children. Give icon-only buttons an accessible name using aria-label or icon.label. Disabled links cannot navigate. Customize appearance with size, variant, color, glass, wide (text buttons) and rounded (icon buttons), or scoped native CSS.`,
	props: [
		{
			name: 'href',
			type: 'string',
			required: 'For links',
			default: 'Omitted',
			description: 'Render an anchor for navigation; omit for a native button.'
		},
		{
			name: 'label',
			type: 'string',
			required: 'For text buttons',
			default: 'Omitted',
			description: 'Visible text; omit for icon-only buttons.'
		},
		{
			name: 'icon',
			type: "Omit<IconProps, 'size' | 'color'>",
			required: 'For icon-only buttons',
			default: 'Omitted',
			description: 'Leading icon; required when label is omitted.'
		},
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'x-small, small, medium, large or x-large.'
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
			description: 'Theme color excluding background.'
		},
		{
			name: 'trailingIcon',
			type: "Omit<IconProps, 'size' | 'color'>",
			required: false,
			default: 'Omitted',
			description: 'Icon after the label; text buttons only.'
		},
		{
			name: 'wide',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Full width; text buttons only.'
		},
		{
			name: 'rounded',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Circular shape; icon-only buttons only.'
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Adds translucent paint and backdrop blur to the selected variant.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disables actions and navigation; uses muted paint for the selected variant.'
		},
		{
			name: 'onClick',
			type: 'MouseEvent handler',
			required: false,
			default: 'Omitted',
			description: 'Click handler for actions and links; replaces native onclick.'
		}
	]
} satisfies ComponentDocProps;
