<script lang="ts">
	import { Terminal as CoreTerminal } from 'bref-ui';
	import type { TerminalProps } from 'bref-ui/types';

	let { style, ...attributes }: TerminalProps = $props();
</script>

<CoreTerminal
	{...attributes}
	style={`
		background: color-mix(in srgb, var(--color-secondary-dark, #82735e) 8%, #171715);
		color: color-mix(in srgb, var(--color-background-dark, #faf9f6) 8%, #faf9f6);
		border-color: color-mix(in srgb, currentColor 18%, transparent);
		border-radius: 0.25rem;
		box-shadow: 0 0.75rem 1.5rem #17171518;
		${style ?? ''}`}
/>
