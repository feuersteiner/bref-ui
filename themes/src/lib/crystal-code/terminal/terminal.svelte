<script lang="ts">
	import { Terminal as CoreTerminal } from 'bref-ui';
	import type { TerminalProps } from 'bref-ui/types';

	let { style, ...attributes }: TerminalProps = $props();
</script>

<CoreTerminal
	{...attributes}
	style={`
		background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark, #8aa7f8) 6%, #141519), #141519);
		color: var(--color-foreground-dark, #d9dade);
		border-color: color-mix(in srgb, currentColor 16%, transparent);
		border-radius: var(--crystal-code-radius, 8px);
		box-shadow: inset 0 1px 0 #ffffff0a, 0 7px 28px #00000020;
		${style ?? ''}`}
/>
