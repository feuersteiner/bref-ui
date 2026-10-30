import type { ComponentDocProps } from '../types/docs.js';

export default {
	description:
		'Set up semantic palettes, native styles, surfaces, glass and icon fonts at the app root.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { Select, Theme, ThemeModeToggle } from 'bref-ui';
  import type { ThemeMode, ThemeProps, Palette, Color } from 'bref-ui/types';
  let mode = $state<ThemeMode>('auto');
  const modes = [
    { id: 'auto', label: 'System' },
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' }
  ];
</script>

<Theme>
  <ThemeModeToggle {mode} />
  <label for="theme-mode">Theme</label>
  <Select id="theme-mode" items={modes}
    bind:value={() => mode, (next) => mode = next as ThemeMode} />
</Theme>
\`\`\`

Render Theme once at the app root to install semantic color tokens, surfaces, glass, fonts and native styles. Supply a partial palette of hex colors or separate light/dark palettes. Children are optional. ThemeModeToggle sets color-scheme metadata; mode is a controlled prop, not a binding. Override CSS tokens explicitly when customizing.`,
	props: [
		{
			name: 'palette',
			type: 'Palette | { dark: Palette; light: Palette }',
			description:
				'Optional semantic hex colors; a shared palette applies to both modes. Invalid hex values throw.',
			default: '{}'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Optional application content.'
		}
	]
} satisfies ComponentDocProps;
