<script lang="ts">
	/* eslint-disable max-lines -- Keep the theme examples and their page styles together. */
	import { getContext, onDestroy } from 'svelte';
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import { Button, Icon, Select, TextInput, Checkbox } from 'bref-ui';
	import type { ThemeMode, ThemeProps, Palette, Color } from 'bref-ui/types';
	const theme = getContext<{ mode: ThemeMode; palette: NonNullable<ThemeProps['palette']> }>(
		'documentation-theme'
	);
	let custom = $state(false);
	let separateModes = $state(false);
	let role = $state<Color>('primary');
	let lightPalette = $state<Palette>({ primary: '#875000' });
	let darkPalette = $state<Palette>({ primary: '#e8bb75' });
	const palette = $derived(
		custom ? (separateModes ? { light: lightPalette, dark: darkPalette } : lightPalette) : {}
	);
	$effect(() => {
		theme.palette = palette;
	});
	onDestroy(() => {
		theme.palette = {};
	});
	const resetPlayground = () => {
		custom = false;
		separateModes = false;
		role = 'primary';
		lightPalette = { primary: '#875000' };
		darkPalette = { primary: '#e8bb75' };
	};
	const defaults: Record<'light' | 'dark', Record<Color, `#${string}`>> = {
		light: {
			primary: '#1d4ed8',
			secondary: '#c51630',
			background: '#f1eee7',
			foreground: '#151515',
			muted: '#696661',
			info: '#2563b8',
			success: '#34745a',
			warning: '#945c08',
			error: '#bc2436'
		},
		dark: {
			primary: '#92b4df',
			secondary: '#df97a5',
			background: '#18191c',
			foreground: '#eceef2',
			muted: '#acb0b8',
			info: '#a3c1d1',
			success: '#abc3a3',
			warning: '#d9bc82',
			error: '#dfa4a7'
		}
	};
	const luminance = (hex: string) => {
		const values = hex
			.slice(1)
			.match(/../g)!
			.map((part) => Number.parseInt(part, 16) / 255)
			.map((channel) =>
				channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
			);
		return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
	};
	const contrast = (foreground: string, background: string) => {
		const a = luminance(foreground),
			b = luminance(background);
		return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
	};
	const contrastResults = $derived(
		(['light', 'dark'] as const).map((mode) => {
			const overrides = custom
				? mode === 'dark' && separateModes
					? darkPalette
					: lightPalette
				: {};
			const background = overrides.background ?? defaults[mode].background;
			const textRatio = contrast(overrides.foreground ?? defaults[mode].foreground, background);
			const filledRatio = contrast(background, overrides.primary ?? defaults[mode].primary);
			const report = (ratio: number) =>
				`${ratio.toFixed(2)}:1${ratio < 4.5 ? ' — below 4.5:1' : ''}`;
			return `${mode}: text ${report(textRatio)}, primary filled ${report(filledRatio)}`;
		})
	);
	const variants = ['neutral', 'soft', 'filled'] as const;
	const noop = () => undefined;
	const source = `<script lang="ts">
  import { Select, Theme, ThemeModeToggle } from 'bref-ui';
  import type { ThemeMode, ThemeProps, Palette, Color } from 'bref-ui/types';
  let mode = $state<ThemeMode>('auto');
  const modes = [
    { id: 'auto', label: 'System' },
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' }
  ];
<${'/'}script>

<Theme>
  <ThemeModeToggle {mode} />
  <label for="theme-mode">Theme</label>
  <Select id="theme-mode" items={modes}
    bind:value={() => mode, (next) => mode = next as ThemeMode} />
</Theme>`;
	const props = [
		{
			name: 'Theme: palette',
			type: 'Palette | { dark: Palette; light: Palette }',
			required: false,
			default: '{}',
			description:
				'Optional hex colors for the nine roles; a single palette applies to both modes. Invalid hex values throw.'
		},
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
	] as const;
</script>

<Page
	title={chapter}
	description="An opt-in theme setup with light, dark and system modes, semantic palette variables, a global reset and the Material Symbols font. ThemeModeToggle sets color-scheme metadata for your own mode control."
>
	<Section {...sections[0]}>
		<div data-control>
			<label for="theme-theme-mode">Demo theme</label>
			<Select
				id="theme-theme-mode"
				items={[
					{ id: 'auto', label: 'System' },
					{ id: 'light', label: 'Light' },
					{ id: 'dark', label: 'Dark' }
				]}
				bind:value={() => theme.mode, (next) => (theme.mode = next as typeof theme.mode)}
			/>
		</div>
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
	<Section {...sections[1]}>
		<p>
			Try a shared palette or separate light and dark colors. Changes apply to the whole demo site
			while this page is open.
		</p>
		<Playground
			onReset={resetPlayground}
			source={`<script>
  import { Theme, ThemeModeToggle, Icon, Button } from 'bref-ui';
<${'/'}script>

<Theme${custom ? ` palette={${JSON.stringify(palette)}}` : ''}>
  <ThemeModeToggle mode="${theme.mode}" />
  <Icon name="check_circle" color="success" label="Complete" size="large" />
${variants.map((variant) => `  <Button variant="${variant}" color="primary" label="${variant}" />`).join('\n')}
  <p>Readable text and semantic colors follow the shared theme.</p>
</Theme>`}
		>
			{#snippet preview()}
				<div data-theme-preview>
					<Icon name="check_circle" color="success" label="Complete" size="large" />
					{#each variants as variant (variant)}<Button
							{variant}
							color="primary"
							label={variant}
							onClick={noop}
						/>{/each}
					<p>Readable text and semantic colors follow the shared theme.</p>
				</div>
			{/snippet}
			{#snippet status()}<p role="status">
					Contrast — {contrastResults.join('; ')}. Ratios cover normal text and the primary filled
					button at rest; check other variants and interaction states separately.
				</p>{/snippet}
			<PlaygroundGroup title="Theme mode">
				<PlaygroundField id="theme-playground-mode" label="Mode">
					<Select
						id="theme-playground-mode"
						items={[
							{ id: 'auto', label: 'System' },
							{ id: 'light', label: 'Light' },
							{ id: 'dark', label: 'Dark' }
						]}
						bind:value={() => theme.mode, (next) => (theme.mode = next as ThemeMode)}
					/>
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Palette">
				<PlaygroundField id="theme-custom" label="Custom palette" toggle>
					<Checkbox id="theme-custom" bind:checked={custom} />
				</PlaygroundField>
				<PlaygroundField id="theme-separate" label="Separate light and dark colors" toggle>
					<Checkbox id="theme-separate" bind:checked={separateModes} />
				</PlaygroundField>
				<PlaygroundField id="theme-role" label="Color role">
					<Select
						id="theme-role"
						items={colors.map((id) => ({ id, label: id }))}
						bind:value={() => role, (next) => (role = next as Color)}
					/>
				</PlaygroundField>
				<PlaygroundField
					id="theme-light-color"
					label={separateModes ? 'Light color' : 'Shared color'}
				>
					<TextInput
						id="theme-light-color"
						type="color"
						value={lightPalette[role] ?? defaults.light[role]}
						onChange={(next) => (lightPalette[role] = next as `#${string}`)}
						wide
					/>
				</PlaygroundField>
				{#if separateModes}<PlaygroundField id="theme-dark-color" label="Dark color">
						<TextInput
							id="theme-dark-color"
							type="color"
							value={darkPalette[role] ?? defaults.dark[role]}
							onChange={(next) => (darkPalette[role] = next as `#${string}`)}
							wide
						/>
					</PlaygroundField>{/if}
				<Button
					label="Use default for this role"
					size="small"
					onClick={() => {
						delete lightPalette[role];
						delete darkPalette[role];
					}}
				/>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections[2]}><PropTable {props} /></Section>
	<Section {...sections[3]}>
		<p>
			Use the navbar theme control to test every example in light, dark or system mode. System
			follows the browser preference.
		</p>
		<p>
			ThemeModeToggle renders color-scheme metadata and has no visible control. Pass a reactive <code
			>
				mode
			</code>
			from an application Select or Button. Theme accepts a children snippet; neither theme component
			forwards native attributes or exposes an element binding.
		</p>
		<p>
			Applications can also set <code>data-theme="light"</code>
			,
			<code>data-theme="dark"</code>
			or
			<code>data-theme="auto"</code>
			on a container to select its palette.
		</p>
	</Section>
	<Section {...sections[4]}>
		<p>
			The active palette includes foreground and background colors, accents and semantic status
			colors.
		</p>
		<div data-demo="palette">
			{#each colors as color (color)}
				<div data-demo="swatch">
					<span style:background={`var(--color-${color})`} aria-hidden="true"></span>
					<code>--color-{color}</code>
				</div>
			{/each}
		</div>
	</Section>
	<Section {...sections[5]}>
		<p>
			Pass palette to the application-root Theme. Omitted roles retain defaults. Existing CSS
			overrides still apply; verify contrast for custom colors.
		</p>
		<CodeSnippet
			label="Palette prop usage"
			source={`<Theme palette={{ primary: '#875000' }} />
<Theme palette={{ light: { primary: '#875000' }, dark: { primary: '#e8bb75' } }} />`}
		/>
		<p>
			Override light and dark variables such as <code>--color-primary-light</code>
			and
			<code>--color-primary-dark</code>
			on
			<code>:root</code>
			or a themed container, or override an active color alias on a specific component. Verify final foreground/background
			contrast.
		</p>
		<p>
			Theme applies a global reset and loads Material Symbols. Components do not import it
			automatically.
		</p>
		<p>
			Body text uses the <code>--font-sans</code>
			system sans fallback without loading a text font. Set
			<code>--font-text</code>
			to use your own font, as this gallery does, or customize
			<code>--font-sans</code>
			. Theme does not set font weight or smoothing.
		</p>
		<p>
			Theme composes internal colors, surfaces, fonts and styles components. Surface and Button
			share the surface paint recipe. Use the typed helper from <code>bref-ui</code>
			on native HTML; copied sources include it at
			<code>theme/surface.ts</code>
			.
		</p>
		<div data-demo="row">
			<Button color="primary" label="Default primary" onClick={noop} />
			<Button
				color="primary"
				label="Local color override"
				onClick={noop}
				style="--color-primary: var(--color-secondary);"
			/>
		</div>
		<CodeSnippet
			label="Theme customization code"
			source={`<Button color="primary" label="Default primary" onClick={save} />
<Button color="primary" label="Local color override" onClick={save} style="--color-primary: var(--color-secondary);" />`}
		/>
	</Section>
</Page>

<style>
	[data-theme-preview] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}
	[data-theme-preview] p {
		flex-basis: 100%;
		text-align: center;
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
	[data-control] {
		display: grid;
		gap: 0.5rem;
		width: min(100%, 12rem);
		min-width: 0;
	}
</style>
