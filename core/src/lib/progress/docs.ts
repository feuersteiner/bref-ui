import type { ComponentDocProps } from '../types/docs.js';

export default {
	description:
		'Show determinate or indeterminate progress, with an optional controlled seek control.',
	usage: `\`\`\`svelte
<script>
  import { Progress } from 'bref-ui';
  let value = $state(0.4);
</script>

<Progress {value} label="Upload progress" />
<Progress label="Loading" />
<Progress {value} onSeek={(next) => value = next} label="Playback position" />
\`\`\`

Use normalized values from 0 to 1; omit value for indeterminate progress. Provide label for the accessible name. Supplying onSeek switches to a native range control and reports normalized values; update value in the handler. disabled affects seeking. Native attributes/events are forwarded. Customize size and inherited color with CSS.`,
	props: [
		{
			name: 'label',
			type: 'string',
			required: false,
			default: '—',
			description: 'Optional accessible name of the indicator or seek control.'
		},
		{
			name: 'value',
			type: 'number',
			required: false,
			default: 'Omitted',
			description: 'Normalized value from 0 to 1. Omit for indeterminate progress.'
		},
		{
			name: 'onSeek',
			type: '(value: number) => void',
			required: false,
			default: 'Omitted',
			description: 'Makes progress seekable and emits normalized values on edits.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disables the seek control when present.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Track thickness: small, medium, or large.'
		}
	]
} satisfies ComponentDocProps;
