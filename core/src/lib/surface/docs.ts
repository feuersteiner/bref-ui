import type { ComponentDocProps } from '../types/docs.js';

export default {
	description:
		'A semantic flex container with theme tints, opt-in glass, shared spacing, corner rounding and optional scrolling.',
	usage: `\`\`\`svelte
<script>
  import { Surface } from 'bref-ui';
</script>

<Surface as="section" variant="soft" spacing="medium" radius="small">
  <h2>Details</h2>
  <p>Content inside the surface.</p>
</Surface>
\`\`\`

\`\`\`svelte
<script>
  import { Theme, surface } from 'bref-ui';
</script>

<Theme />
<button class={surface({ variant: 'filled', color: 'primary', shadow: 'small', hover: 'medium' })}>
  Save
</button>
\`\`\`

\`\`\`svelte
<script>
  import { Surface } from 'bref-ui';
</script>

<div style="height: 12rem;">
  <Surface scroll height="fill">
    Content
  </Surface>
</div>
\`\`\`

Use as to choose a semantic div, section or span. Native attributes, events and children are forwarded. Choose orientation, spacing and dimensions for layout, then variant, color, glass, shadow and radius for appearance. Scroll regions need a constrained parent height and an accessible name. The surface helper provides typed props for reuse.`,
	props: [
		{
			name: 'as',
			type: "'div' | 'section' | 'span'",
			default: 'div',
			description: 'Native root element.',
			required: false
		},
		{
			name: 'children',
			type: 'Snippet',
			default: 'Omitted',
			description: 'Content rendered directly inside the root.',
			required: false
		},
		{
			name: 'color',
			type: 'Color',
			default: 'background',
			description: 'Theme color; the shared recipe supplies content color.',
			required: false
		},
		{
			name: 'variant',
			type: 'Variant',
			default: 'neutral',
			description: 'Lightly tinted neutral, opaque tinted soft, or opaque filled panel.',
			required: false
		},
		{
			name: 'spacing',
			type: 'Size',
			default: 'Omitted',
			description: 'Shared padding and gap; omitted means zero.',
			required: false
		},
		{
			name: 'orientation',
			type: 'Orientation',
			default: 'vertical',
			description: 'Column, or row with centered cross-axis alignment.',
			required: false
		},
		{
			name: 'width',
			type: 'Dimension',
			default: 'fill',
			description: 'fill uses 100%; fit hugs content.',
			required: false
		},
		{
			name: 'height',
			type: 'Dimension',
			default: 'fit',
			description: 'fit uses natural height; fill uses 100% of a sized parent.',
			required: false
		},
		{
			name: 'radius',
			type: 'Size | `${number}rem` | `${number}%`',
			default: 'Omitted (0)',
			description: 'Named corner scale or an explicit rem/percentage radius.',
			required: false
		},
		{
			name: 'shadow',
			type: 'BaseSize | boolean',
			default: 'false',
			description: 'Shadow strength; true selects medium.',
			required: false
		},
		{
			name: 'hover',
			type: 'BaseSize',
			default: 'Omitted',
			description: 'Optional hover/focus treatment; does not make the root interactive.',
			required: false
		},
		{
			name: 'scroll',
			type: 'boolean',
			default: 'false',
			description: 'true sets overflow to auto; otherwise overflow stays visible.',
			required: false
		},
		{
			name: 'glass',
			type: 'boolean',
			default: 'false',
			description: 'Enable translucent paint and backdrop blur.',
			required: false
		}
	]
} satisfies ComponentDocProps;
