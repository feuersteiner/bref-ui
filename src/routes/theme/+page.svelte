<script lang="ts">
	/* eslint-disable max-lines -- Keep the theme examples and their page styles together. */
	import { getContext } from 'svelte';
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Button, Icon } from '$lib/index.js';
	import type { ThemeMode } from '$lib/types.js';
	const theme = getContext<{ mode: ThemeMode }>('documentation-theme');
	const variants = ['neutral', 'soft', 'filled'] as const;
	const noop = () => undefined;
	const source = `<script>
  import { Theme, ThemeModeToggle } from 'bref';
  let mode = $state('auto');
<${'/'}script>

<Theme>
  <ThemeModeToggle {mode} />
  <label>Theme
    <select bind:value={mode}>
      <option value="auto">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
</Theme>`;
	const props = [
		{
			name: 'Theme: children',
			type: 'Snippet',
			required: false,
			default: 'Omitted',
			description: 'Application content.'
		},
		{
			name: 'ThemeModeToggle: mode',
			type: 'ThemeMode',
			required: false,
			default: 'auto',
			description: 'light, dark or auto (system preference).'
		}
	];
	const colors = [
		'primary',
		'secondary',
		'foreground',
		'background',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	];
</script>

<Page
	title={chapter}
	description="An opt-in theme setup with light, dark and system modes, semantic palette variables, a global reset and the Material Symbols font. ThemeModeToggle sets color-scheme metadata for your own mode control."
>
	<Section {...sections[0]}>
		<label
			>Demo theme
			<select bind:value={theme.mode}>
				<option value="auto">System</option>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		</label>
		<p>Current mode: {theme.mode}. This control and the navbar control share the same mode.</p>
		<div data-demo="row">
			<Icon name="check_circle" color="success" label="Complete" size="large" />
			{#each variants as variant (variant)}<Button
					{variant}
					color="primary"
					label={variant}
					onClick={noop}
				/>{/each}
			<Button label="Disabled" onClick={noop} disabled />
		</div>
		<CodeSnippet {source} label="Theme usage code" />
	</Section>
	<Section {...sections[1]}><PropTable {props} /></Section>
	<Section {...sections[2]}>
		<p>
			Use the navbar theme control to test every example in light, dark or system mode. System
			follows the browser preference.
		</p>
		<p>
			ThemeModeToggle renders color-scheme metadata and has no visible control. Pass a reactive <code
				>mode</code
			> from an application select or button. Theme accepts a children snippet; neither theme component
			forwards native attributes or exposes an element binding.
		</p>
		<p>
			Applications can also set <code>data-theme="light"</code>, <code>data-theme="dark"</code> or
			<code>data-theme="auto"</code> on a container to select its palette.
		</p>
	</Section>
	<Section {...sections[3]}>
		<p>
			The active palette includes foreground and background colors, accents and semantic status
			colors.
		</p>
		<div data-demo="palette">
			{#each colors as color (color)}
				<div data-demo="swatch">
					<span style:background={`var(--color-${color})`} aria-hidden="true"></span><code
						>--color-{color}</code
					>
				</div>
			{/each}
		</div>
	</Section>
	<Section {...sections[4]}>
		<p>
			Override light and dark variables such as <code>--color-primary-light</code> and
			<code>--color-primary-dark</code>
			on <code>:root</code> or a themed container, or override an active color alias on a specific component.
			Verify final foreground/background contrast.
		</p>
		<p>
			Theme applies a global reset and loads Material Symbols. Components do not import it
			automatically.
		</p>
		<div data-demo="row">
			<Button color="primary" label="Default primary" onClick={noop} />
			<Button
				color="primary"
				label="Local color override"
				onClick={noop}
				stylesOverride={{ style: '--color-primary: var(--color-secondary);' }}
			/>
		</div>
		<CodeSnippet
			label="Theme customization code"
			source={`<Button color="primary" label="Default primary" onClick={save} />
<Button color="primary" label="Local color override" onClick={save} stylesOverride={{ style: '--color-primary: var(--color-secondary);' }} />`}
		/>
	</Section>
</Page>

<style>
	label {
		display: grid;
		gap: 12px;
		width: min(100%, 240px);
		color: var(--color-muted);
	}
	[data-demo='row'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px;
	}
	[data-demo='palette'] {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
		gap: 24px;
	}
	[data-demo='swatch'] {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	[data-demo='swatch'] > span {
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--color-foreground);
	}
</style>
