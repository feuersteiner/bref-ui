<script lang="ts">
	import { Terminal as CoreTerminal } from 'bref-ui';
	import type { TerminalProps } from 'bref-ui/types';

	let { style, ...attributes }: TerminalProps = $props();
</script>

<CoreTerminal
	{...attributes}
	style={`
		background: var(--color-background-dark, #1e1e1e);
		color: var(--color-foreground-dark, #cccccc);
		border-color: var(--vscode-border, #454545);
		border-radius: 2px;
		box-shadow: none;
		${style ?? ''}`}
/>
