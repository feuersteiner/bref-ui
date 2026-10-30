import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'Show loading status or a decorative animated ring.',
	usage: `\`\`\`svelte
<script>
  import { Spinner } from 'bref-ui';
</script>

<Spinner label="Loading results" />
\`\`\`

\`\`\`svelte
<script>
  import { Spinner } from 'bref-ui';
</script>

<span style="color: var(--color-primary)"><Spinner label="Loading results" /></span>
\`\`\`

Provide label to announce loading status; omit it for a decorative ring hidden from assistive technology. Size and color inherit by default. Only label and size are accepted. Customize size or inherited CSS color; motion respects reduced-motion preferences.`,
	props: [
		{
			name: 'label',
			type: 'string',
			required: false,
			default: '—',
			description: 'Optional screen reader status text; omit for a decorative ring.'
		},
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'Inherited',
			description: 'Matches Icon sizes; omitted size inherits surrounding font size.'
		}
	]
} satisfies ComponentDocProps;
