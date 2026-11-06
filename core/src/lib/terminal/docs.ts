import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'Display plain-text output in a compact, dark macOS-style terminal window.',
	usage: `\`\`\`svelte
<script>
  import { Terminal } from 'bref-ui';
</script>

<Terminal
  lines={['$ bun install', '✓ Ready to build']}
  windowTitle="bref — terminal"
/>
\`\`\`

Each string is rendered as text, separated by a newline; whitespace and blank entries are preserved. Markup, ANSI escapes and commands are not interpreted. An empty array leaves an empty viewport. Replacing lines updates the output without animation or automatic scrolling.

The native div forwards attributes and events, including class, style, title, dir, aria-* and tabindex. It is a keyboard-focusable, named region so overflowing output can be scrolled with the keyboard. aria-label or aria-labelledby can supply a different accessible name. The traffic-light dots are decorative, not controls. There is no input, children snippet or default live announcement; opt into aria-live only when appropriate for your update frequency.

The viewport stays dark on light pages using the existing --color-background-dark and --color-foreground-dark palette tokens. Customize dimensions, border radius, background and text color with native style or class; max-height defaults to 24rem. No fonts or animations are loaded.`,
	props: [
		{
			name: 'lines',
			type: 'readonly string[]',
			required: true,
			description: 'Output entries in display order, separated by newlines.'
		},
		{
			name: 'windowTitle',
			type: 'string',
			default: 'Terminal',
			description:
				'Visible title and default accessible name; an empty title keeps a Terminal label.'
		}
	]
} satisfies ComponentDocProps;
