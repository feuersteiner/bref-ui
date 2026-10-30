import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'Set color-scheme metadata for an app theme control.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { ThemeModeToggle } from 'bref-ui';
  import type { ThemeMode } from 'bref-ui/types';
  let mode = $state<ThemeMode>('auto');
</script>

<ThemeModeToggle {mode} />
<label>Appearance
  <select bind:value={mode}>
    <option value="auto">System</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</label>
\`\`\`

Render once at the app root. This component emits color-scheme metadata and has no visible control. Pass a reactive mode prop; auto allows the system preference, light and dark force a scheme. Build a labeled native control to update mode. The mode prop is not bindable.`,
	props: [
		{
			name: 'mode',
			type: "'light' | 'dark' | 'auto'",
			description: 'light, dark or auto; controls color-scheme metadata.',
			default: 'auto'
		}
	]
} satisfies ComponentDocProps;
