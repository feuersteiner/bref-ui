<script lang="ts">
	import { Terminal as CoreTerminal } from 'bref-ui';
	import type { TerminalProps } from 'bref-ui/types';

	let { style, ...attributes }: TerminalProps = $props();
</script>

<CoreTerminal
	{...attributes}
	style={`
		background: linear-gradient(145deg, color-mix(in srgb, var(--color-primary-dark, #0068d9) 8%, #202a35), #171e27);
		color: color-mix(in srgb, var(--color-background-dark, #f5f6f7) 8%, #f5f6f7);
		border-color: color-mix(in srgb, currentColor 24%, transparent);
		border-radius: 1.25rem;
		box-shadow: inset 0 1px 0 #ffffff18, 0 1rem 2.5rem #152c3d26;
		${style ?? ''}`}
/>
