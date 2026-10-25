<script lang="ts">
	/* eslint-disable max-lines -- Keep the prop matrix and interactive examples in their documentation page. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import DemoGroup from '../components/demo-group.svelte';
	import MovingBackground from '../components/moving-background.svelte';
	import { Button, TextInput, Select, Checkbox, Switch } from 'bref-ui';
	import type { Color, Size, Variant, IconName } from 'bref-ui/types';

	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const variants = ['neutral', 'soft', 'filled'] as const;
	const colors = [
		'primary',
		'secondary',
		'foreground',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	] as const;
	let size = $state<Size>('medium');
	let variant = $state<Variant>('neutral');
	let color = $state<Exclude<Color, 'background'>>('foreground');
	let disabled = $state(false);
	let wide = $state(false);
	let rounded = $state(false);
	let filled = $state(false);
	let label = $state('Save');
	let leading = $state(true);
	let trailing = $state(true);
	let clicks = $state(0);
	let pressed = $state(false);
	let submitted = $state('No submission yet.');
	let matrixOpen = $state(false);
	let movingBackground = $state(false);
	let glass = $state(false);
	let link = $state(false);
	let href = $state('#playground');
	let iconName = $state<IconName>('save');
	let trailingName = $state<IconName>('arrow_forward');
	let iconLabel = $state('Save');
	let ariaLabel = $state('');
	let trackClicks = $state(true);
	const names = ['save', 'favorite', 'star', 'search', 'add', 'arrow_forward', 'check'] as const;
	const previewLabel = $derived(label);
	const resetPlayground = () => {
		size = 'medium';
		variant = 'neutral';
		color = 'foreground';
		disabled = wide = rounded = filled = movingBackground = glass = link = false;
		trackClicks = true;
		href = '#playground';
		iconName = 'save';
		trailingName = 'arrow_forward';
		iconLabel = 'Save';
		ariaLabel = '';
		label = 'Save';
		leading = trailing = true;
		clicks = 0;
	};
	const noop = () => undefined;
	const source = `<script>
  import { Button } from 'bref-ui';
<${'/'}script>

<Button label="Save" onClick={() => undefined} />
<Button label="Next" href="/next" color="primary" variant="filled" trailingIcon={{ name: 'arrow_forward' }} />
<Button icon={{ name: 'favorite', filled: true }} rounded onClick={() => undefined} aria-label="Favorite" />
<Button label="Unavailable" disabled />`;

	const props = [
		{
			name: 'href',
			type: 'string',
			required: 'For links',
			default: 'Omitted',
			description: 'Render an anchor for navigation; omit for a native button.'
		},
		{
			name: 'label',
			type: 'string',
			required: 'For text buttons',
			default: 'Omitted',
			description: 'Visible text; omit for icon-only buttons.'
		},
		{
			name: 'icon',
			type: "Omit<IconProps, 'size' | 'color'>",
			required: 'For icon-only buttons',
			default: 'Omitted',
			description: 'Leading icon; required when label is omitted.'
		},
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'x-small, small, medium, large or x-large.'
		},
		{
			name: 'variant',
			type: 'Variant',
			required: false,
			default: 'neutral',
			description: 'neutral, soft or filled.'
		},
		{
			name: 'color',
			type: "Exclude<Color, 'background'>",
			required: false,
			default: 'foreground',
			description: 'Theme color excluding background.'
		},
		{
			name: 'trailingIcon',
			type: "Omit<IconProps, 'size' | 'color'>",
			required: false,
			default: 'Omitted',
			description: 'Icon after the label; text buttons only.'
		},
		{
			name: 'wide',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Full width; text buttons only.'
		},
		{
			name: 'rounded',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Circular shape; icon-only buttons only.'
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Adds translucent paint and backdrop blur to the selected variant.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disables actions and navigation; uses muted paint for the selected variant.'
		},
		{
			name: 'onClick',
			type: 'MouseEvent handler',
			required: false,
			default: 'Omitted',
			description: 'Click handler for actions and links; replaces native onclick.'
		}
	];
</script>

<Page
	title={chapter}
	description="An action or navigation control with text or icon labels, theme colors, five sizes, three variants, and wide, rounded or disabled options."
>
	<Section {...sections[0]}>
		<div data-demo="row">
			<Button label="Save" onClick={noop} />
			<Button
				label="Next"
				href="#native-behavior"
				color="primary"
				variant="filled"
				trailingIcon={{ name: 'arrow_forward' }}
			/>
			<Button
				icon={{ name: 'favorite', filled: true }}
				rounded
				onClick={noop}
				aria-label="Favorite"
			/>
			<Button label="Unavailable" onClick={noop} disabled />
		</div>
		<CodeSnippet {source} label="Button usage code" />
	</Section>
	<Section {...sections[1]}>
		<p>
			Combine appearance, content and behavior. Glass and the preview background are independent.
		</p>
		<Playground
			onReset={resetPlayground}
			source={`<script>
  import { Button } from 'bref-ui';${trackClicks ? '\n  let clicks = $state(0);\n  const activate = () => clicks++;' : ''}
<${'/'}script>

<Button label={${JSON.stringify(previewLabel)}}${link ? ` href={${JSON.stringify(href)}}` : ''} glass={${glass}} size="${size}" variant="${variant}" color="${color}" wide={${wide}} icon={${leading ? `{ name: '${iconName}', filled: ${filled} }` : 'undefined'}} trailingIcon={${trailing ? `{ name: '${trailingName}', filled: ${filled} }` : 'undefined'}} disabled={${disabled}}${trackClicks ? ' onClick={activate}' : ''} />
<Button${link ? ` href={${JSON.stringify(href)}}` : ''} glass={${glass}} size="${size}" variant="${variant}" color="${color}" rounded={${rounded}} icon={{ name: '${iconName}', label: ${JSON.stringify(iconLabel)}, filled: ${filled} }} disabled={${disabled}}${ariaLabel ? ` aria-label={${JSON.stringify(ariaLabel)}}` : ''}${trackClicks ? ' onClick={activate}' : ''} />`}
		>
			{#snippet preview()}
				{#if movingBackground}<MovingBackground />{/if}
				<div data-preview-buttons data-wide={wide}>
					{#if link}
						<Button
							label={previewLabel}
							{href}
							{glass}
							{size}
							{variant}
							{color}
							{wide}
							icon={leading ? { name: iconName, filled } : undefined}
							trailingIcon={trailing ? { name: trailingName, filled } : undefined}
							{disabled}
							onClick={trackClicks ? () => clicks++ : undefined}
						/>
					{:else}
						<Button
							label={previewLabel}
							{glass}
							{size}
							{variant}
							{color}
							{wide}
							icon={leading ? { name: iconName, filled } : undefined}
							trailingIcon={trailing ? { name: trailingName, filled } : undefined}
							{disabled}
							onClick={trackClicks ? () => clicks++ : undefined}
						/>
					{/if}
					<div>
						{#if link}
							<Button
								{href}
								{glass}
								{size}
								{variant}
								{color}
								{rounded}
								icon={{ name: iconName, label: iconLabel || undefined, filled }}
								{disabled}
								aria-label={ariaLabel || undefined}
								onClick={trackClicks ? () => clicks++ : undefined}
							/>
						{:else}
							<Button
								{glass}
								{size}
								{variant}
								{color}
								{rounded}
								icon={{ name: iconName, label: iconLabel || undefined, filled }}
								{disabled}
								aria-label={ariaLabel || undefined}
								onClick={trackClicks ? () => clicks++ : undefined}
							/>
						{/if}
					</div>
				</div>
			{/snippet}
			{#snippet status()}<p role="status">
					Activated {clicks} times. Try Tab, Enter and Space.
				</p>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="button-size" label="Size">
					<Select
						id="button-size"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => size, (next) => (size = next as typeof size)}
					/>
				</PlaygroundField><PlaygroundField id="button-variant" label="Variant">
					<Select
						id="button-variant"
						items={variants.map((id) => ({ id, label: id }))}
						bind:value={() => variant, (next) => (variant = next as typeof variant)}
					/>
				</PlaygroundField><PlaygroundField id="button-color" label="Color">
					<Select
						id="button-color"
						items={colors.map((id) => ({ id, label: id }))}
						bind:value={() => color, (next) => (color = next as typeof color)}
					/>
				</PlaygroundField><PlaygroundField id="button-glass" label="Glass" toggle>
					<Checkbox id="button-glass" bind:checked={glass} />
				</PlaygroundField><PlaygroundField id="button-wide" label="Wide text button" toggle>
					<Checkbox id="button-wide" bind:checked={wide} />
				</PlaygroundField><PlaygroundField id="button-rounded" label="Rounded icon button" toggle>
					<Checkbox id="button-rounded" bind:checked={rounded} />
				</PlaygroundField>
			</PlaygroundGroup><PlaygroundGroup title="Content">
				<PlaygroundField id="button-label" label="Label">
					<TextInput id="button-label" bind:value={label} wide />
				</PlaygroundField><PlaygroundField id="button-icon-name" label="Leading / icon-only glyph">
					<Select
						id="button-icon-name"
						items={names.map((id) => ({ id, label: id }))}
						bind:value={() => iconName, (next) => (iconName = next as typeof iconName)}
					/>
				</PlaygroundField><PlaygroundField id="button-trailing-name" label="Trailing glyph">
					<Select
						id="button-trailing-name"
						items={names.map((id) => ({ id, label: id }))}
						bind:value={() => trailingName, (next) => (trailingName = next as typeof trailingName)}
					/>
				</PlaygroundField><PlaygroundField id="button-leading" label="Leading icon" toggle>
					<Checkbox id="button-leading" bind:checked={leading} />
				</PlaygroundField><PlaygroundField id="button-trailing" label="Trailing icon" toggle>
					<Checkbox id="button-trailing" bind:checked={trailing} />
				</PlaygroundField><PlaygroundField id="button-filled" label="Filled icons" toggle>
					<Checkbox id="button-filled" bind:checked={filled} />
				</PlaygroundField><PlaygroundField id="button-icon-label" label="Icon label (fallback)">
					<TextInput id="button-icon-label" bind:value={iconLabel} wide />
				</PlaygroundField><PlaygroundField id="button-aria-label" label="Accessible name override">
					<TextInput id="button-aria-label" bind:value={ariaLabel} wide />
				</PlaygroundField>
			</PlaygroundGroup><PlaygroundGroup title="Behavior">
				<PlaygroundField id="button-disabled" label="Disabled" toggle>
					<Checkbox id="button-disabled" bind:checked={disabled} />
				</PlaygroundField><PlaygroundField id="button-link" label="Render links" toggle>
					<Checkbox id="button-link" bind:checked={link} />
				</PlaygroundField><PlaygroundField id="button-href" label="Link destination">
					<TextInput id="button-href" bind:value={href} wide />
				</PlaygroundField><PlaygroundField id="button-track" label="Track activations" toggle>
					<Checkbox id="button-track" bind:checked={trackClicks} />
				</PlaygroundField><PlaygroundField id="button-background" label="Moving background" toggle>
					<Switch id="button-background" bind:checked={movingBackground} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections[2]}>
		<p>
			At the default root font size, the five sizes start at 28, 32, 40, 48 and 56 pixels tall.
			Coarse pointers receive at least a 44-pixel target. Text can wrap and controls grow with
			larger text.
		</p>
		<div data-demo="matrix" data-transparency={movingBackground}>
			{#if movingBackground}<MovingBackground />{/if}
			<DemoGroup title="Sizes">
				<div data-demo="row">
					{#each sizes as size (size)}
						<Button {glass} {size} color="primary" label={size} onClick={noop} />
					{/each}
				</div>
			</DemoGroup>
			<DemoGroup title="Variants">
				<div data-demo="row">
					{#each variants as variant (variant)}
						<Button {glass} {variant} color="primary" label={variant} onClick={noop} />
					{/each}
				</div>
			</DemoGroup>
			<DemoGroup title="Colors">
				<div data-demo="row">
					{#each colors as color (color)}
						<Button {glass} {color} label={color} onClick={noop} />
					{/each}
				</div>
			</DemoGroup>
			<DemoGroup title="Text and icon shapes">
				<div data-demo="row">
					<Button {glass} color="primary" label="Save" icon={{ name: 'save' }} onClick={noop} />
					<Button {glass} color="primary" icon={{ name: 'add' }} onClick={noop} aria-label="Add" />
					<Button
						color="primary"
						rounded
						icon={{ name: 'favorite', filled: true }}
						onClick={noop}
						aria-label="Favorite"
					/>
				</div>
			</DemoGroup>
			{#each variants as variant (variant)}
				<DemoGroup title={`Disabled ${variant}`}>
					<div data-demo="row">
						{#each colors as color (color)}
							<Button {glass} {variant} {color} label={color} disabled />
						{/each}
					</div>
				</DemoGroup>
			{/each}
		</div>
		<p>The exhaustive QA matrix is mounted only when requested.</p>
		<div data-demo="row">
			<Button
				label={matrixOpen ? 'Hide exhaustive matrix' : 'Load exhaustive matrix'}
				color="primary"
				variant="soft"
				onClick={() => (matrixOpen = !matrixOpen)}
				aria-controls="exhaustive-button-matrix"
				aria-expanded={matrixOpen}
			/>
		</div>
		<div id="exhaustive-button-matrix">
			{#if matrixOpen}
				<div data-demo="matrix">
					{#each variants as value (value)}
						<DemoGroup title={`${value}: sizes and shapes`}>
							<div data-demo="row">
								{#each sizes as size (size)}
									<div data-demo="group">
										<span>{size}</span>
										<Button
											{size}
											variant={value}
											color="primary"
											label="Save"
											icon={{ name: 'save' }}
											{disabled}
											onClick={noop}
										/>
										<Button
											{size}
											variant={value}
											color="primary"
											icon={{ name: 'add' }}
											{disabled}
											onClick={noop}
											aria-label={`Add (${size}, ${value})`}
										/>
										<Button
											{size}
											variant={value}
											color="primary"
											rounded
											icon={{ name: 'favorite', filled: true }}
											{disabled}
											onClick={noop}
											aria-label={`Favorite (${size}, ${value})`}
										/>
									</div>
								{/each}
							</div>
						</DemoGroup>
						<DemoGroup title={`${value}: colors and shapes`}>
							<div data-demo="row">
								{#each colors as color (color)}
									<div data-demo="group">
										<Button
											{glass}
											{color}
											variant={value}
											label={color}
											{disabled}
											onClick={noop}
										/>
										<Button
											{color}
											variant={value}
											icon={{ name: 'add' }}
											{disabled}
											onClick={noop}
											aria-label={`Add (${color}, ${value})`}
										/>
										<Button
											{color}
											variant={value}
											rounded
											icon={{ name: 'favorite', filled: true }}
											{disabled}
											onClick={noop}
											aria-label={`Favorite (${color}, ${value})`}
										/>
									</div>
								{/each}
							</div>
						</DemoGroup>
					{/each}
				</div>
			{/if}
		</div>
	</Section>
	<Section {...sections[3]}><PropTable {props} /></Section>
	<Section {...sections[4]}>
		<p>
			Use <code>onClick</code>
			for actions or
			<code>href</code>
			for navigation. Pass native button or anchor attributes directly, including form attributes, ARIA
			attributes and events except
			<code>onclick</code>
			, which uses
			<code>onClick</code>
			,
			<code>class</code>
			and
			<code>style</code>
			.
		</p>
		<p>
			Button uses <code>type="button"</code>
			unless overridden. Set
			<code>type</code>
			to
			<code>submit</code>
			or
			<code>reset</code>
			for native form actions. Button does not accept a children snippet or expose an element binding.
		</p>
		<p>
			Use native <code>target</code>
			and
			<code>rel</code>
			for links. Event handlers are optional; button handlers receive an HTMLButtonElement currentTarget
			and link handlers an HTMLAnchorElement.
		</p>
		<div data-demo="row">
			<Button label="Disabled" onClick={noop} disabled />
			<Button
				label="Saving…"
				variant="filled"
				icon={{ name: 'sync' }}
				onClick={noop}
				disabled
				aria-busy={true}
			/>
			<Button
				label={pressed ? 'Selected' : 'Select'}
				variant="filled"
				color="primary"
				onClick={() => (pressed = !pressed)}
				aria-pressed={pressed}
			/>
			<Button
				label="Style override"
				onClick={noop}
				class="custom-button"
				style="font-style: italic;"
				title="Native title attribute"
			/>
		</div>
		<Button
			label="Full-width action"
			wide
			icon={{ name: 'save' }}
			trailingIcon={{ name: 'arrow_forward' }}
			onClick={noop}
		/>
		<Button
			label="Full-width link in a new tab"
			href="#native-behavior"
			wide
			target="_blank"
			rel="noopener noreferrer"
			color="primary"
			variant="soft"
			trailingIcon={{ name: 'open_in_new' }}
		/>
		<Button
			label="Disabled link"
			href="#native-behavior"
			target="_blank"
			rel="noopener noreferrer"
			disabled
		/>
		<Button
			label="A long label that wraps on a narrow screen without losing its meaning"
			size="small"
			onClick={noop}
		/>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget, event.submitter);
				submitted = `Submitted: ${data.get('message')} (${data.get('action')})`;
			}}
			onreset={() => (submitted = 'Form reset.')}
		>
			<label>
				Message <TextInput name="message" value="Hello" required />
			</label>
			<div data-demo="row">
				<Button label="Submit" onClick={noop} type="submit" name="action" value="save" />
				<Button label="Reset" onClick={noop} type="reset" />
			</div>
		</form>
		<p role="status">{submitted}</p>
		<CodeSnippet
			label="Button native behavior code"
			source={`<Button label="Saving…" icon={{ name: 'sync' }} variant="filled" onClick={save} disabled aria-busy={true} />
<Button label="Submit" onClick={save} type="submit" name="action" value="save" />
<Button label="Reset" onClick={reset} type="reset" />
<Button label="Full-width link in a new tab" href="#native-behavior" wide target="_blank" rel="noopener noreferrer" color="primary" variant="soft" trailingIcon={{ name: 'open_in_new' }} />`}
		/>
	</Section>
	<Section {...sections[5]}>
		<p>
			Use a visible label for text buttons and <code>aria-label</code>
			for icon-only buttons. Icon-only names fall back to the icon label, then its name. Rendered icons
			are decorative.
		</p>
		<p>
			Enter and Space activate focused buttons; disabled buttons skip keyboard navigation. Compose
			pending states with <code>disabled</code>
			and
			<code>aria-busy</code>
			; there is no loading prop. Verify contrast when changing colors or surfaces.
		</p>
	</Section>
</Page>

<style>
	[data-demo='row'] {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px;
	}
	[data-demo='matrix'] {
		display: grid;
		gap: 32px;
	}
	[data-transparency] {
		position: relative;
		isolation: isolate;
	}
	[data-transparency='true'] {
		padding: 2rem;
	}
	[data-preview-buttons] {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 24px;
		min-width: 0;
	}
	[data-preview-buttons][data-wide='true'] {
		flex-direction: column;
		align-items: stretch;
	}
	[data-preview-buttons][data-wide='true'] > div {
		align-self: center;
	}
	p[role='status'] {
		margin: 0;
	}
	[data-demo='group'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}
	[data-demo='group'] > span {
		flex-basis: 100%;
	}
	form {
		display: grid;
		gap: 24px;
	}
</style>
