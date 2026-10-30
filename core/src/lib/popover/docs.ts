import type { ComponentDocProps } from '../types/docs.js';

export default {
	description:
		'An anchored native popover whose trigger snippet renders the owning control or component.',
	usage: `\`\`\`svelte
<script>
  import { Checkbox, Popover, TextInput } from 'bref-ui';
  let open = $state(false);
  let wide = $state(false);
</script>

<label><Checkbox bind:checked={wide} /> Wide input</label>
<Popover bind:open scroll>
  {#snippet trigger()}
    <TextInput {wide} value="Sample text" aria-label="Search" aria-expanded={open}
      oninput={() => open = true} onclick={() => open = true} />
  {/snippet}
  <p>Helpful details beside the input.</p>
</Popover>
\`\`\`

\`\`\`svelte
<script>
  import { Button, Popover, TextInput } from 'bref-ui';
  let open = $state(false);
</script>

<Popover bind:open variant="filled" spacing="medium" radius="small" shadow scroll>
  {#snippet trigger()}
    <Button label="Edit settings" onClick={() => open = !open}
      aria-expanded={open} />
  {/snippet}
  <label>Display name <TextInput value="Example" /></label>
  <Button label="Done" onClick={() => open = false} />
</Popover>
\`\`\`

Bind open and render the owning native control or component inside the trigger snippet. Supply aria-expanded and an accessible name on that control. The component wires popover targeting, supports light dismissal and Escape, and closes when disabled. Children supply panel content. Customize supported Surface appearance/layout props; arbitrary native attributes are not accepted.`,
	props: [
		{
			name: 'trigger',
			type: 'Snippet',
			required: true,
			default: '—',
			description: 'The owning control or component; manages its own events and accessibility.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: true,
			default: '—',
			description: 'Parameterless content inside the popover.'
		},
		{
			name: 'open',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bindable visibility; native dismissals update it.',
			bindable: true
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Keep the panel closed; the trigger controls its own disabled state.'
		},
		{
			name: 'as',
			type: "'div' | 'section' | 'span'",
			required: false,
			default: 'div',
			description: 'Native root element of the Surface inside the panel.'
		},
		{
			name: 'variant',
			type: 'Variant',
			required: false,
			default: 'soft',
			description: 'neutral, soft or filled; every variant uses glass.'
		},
		{
			name: 'color',
			type: 'Color',
			required: false,
			default: 'background',
			description: 'Theme role for panel paint.'
		},
		{
			name: 'shadow',
			type: 'BaseSize | boolean',
			required: false,
			default: 'medium',
			description: 'Shadow strength; true means medium and false disables it.'
		},
		{
			name: 'hover',
			type: 'BaseSize',
			required: false,
			default: 'Omitted',
			description: 'Optional hover treatment strength.'
		},
		{
			name: 'spacing',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'Padding and gap from x-small to x-large.'
		},
		{
			name: 'orientation',
			type: 'Orientation',
			required: false,
			default: 'vertical',
			description: 'Horizontal or vertical Surface layout.'
		},
		{
			name: 'width',
			type: 'Dimension',
			required: false,
			default: 'Omitted',
			description:
				'fill follows trigger width; fit or omitted grows with content, at least as wide as the trigger.'
		},
		{
			name: 'height',
			type: 'Dimension',
			required: false,
			default: 'Omitted',
			description:
				'fit follows content; fill fills available Surface height within the viewport cap.'
		},
		{
			name: 'radius',
			type: 'SurfaceRadius',
			required: false,
			default: 'small',
			description: 'Size token, rem value or percentage.'
		},
		{
			name: 'scroll',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Enable scrolling within the Surface.'
		},
		{
			name: 'class',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Additional Surface classes.'
		},
		{
			name: 'style',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Inline styles on the Surface.'
		}
	]
} satisfies ComponentDocProps;
