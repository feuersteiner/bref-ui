<script lang="ts">
	/* eslint-disable max-lines -- Keep the prop matrix and interactive examples in their documentation page. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Button } from '$lib/index.js';
	import type { Color, Size, Variant } from '$lib/types.js';

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
	const source = `<script>
  import { Button } from 'bref';
<${'/'}script>

<Button label="Save" />
<Button label="Next" color="primary" variant="filled" trailingIcon={{ name: 'arrow_forward' }} />
<Button icon={{ name: 'favorite', filled: true }} rounded stylesOverride={{ 'aria-label': 'Favorite' }} />
<Button label="Unavailable" stylesOverride={{ disabled: true }} />`;

	const props = [
		{
			name: 'label',
			type: 'string',
			required: 'For text buttons',
			default: 'Omitted',
			description: 'Visible text; omit for icon-only buttons.'
		},
		{
			name: 'icon',
			type: 'IconProps',
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
			type: 'IconProps',
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
			name: 'stylesOverride',
			type: 'HTMLButtonAttributes',
			required: false,
			default: 'Omitted',
			description: 'Native button attributes and events.'
		}
	];
</script>

<Page
	title={chapter}
	description="A native button with labels, icons, theme colors, sizes and variants."
>
	<Section {...sections[0]}>
		<div data-demo="row">
			<Button label="Save" />
			<Button
				label="Next"
				color="primary"
				variant="filled"
				trailingIcon={{ name: 'arrow_forward' }}
			/>
			<Button
				icon={{ name: 'favorite', filled: true }}
				rounded
				stylesOverride={{ 'aria-label': 'Favorite' }}
			/>
			<Button label="Unavailable" stylesOverride={{ disabled: true }} />
		</div>
		<CodeSnippet {source} />
	</Section>
	<Section {...sections[1]}>
		<p>Change every custom prop together; text and icon-only buttons share the controls.</p>
		<div data-demo="controls">
			<label>Label <input bind:value={label} /></label>
			<label
				>Size <select bind:value={size}
					>{#each sizes as value (value)}<option>{value}</option>{/each}</select
				></label
			>
			<label
				>Variant <select bind:value={variant}
					>{#each variants as value (value)}<option>{value}</option>{/each}</select
				></label
			>
			<label
				>Color <select bind:value={color}
					>{#each colors as value (value)}<option>{value}</option>{/each}</select
				></label
			>
			<label><input type="checkbox" bind:checked={leading} /> Leading icon</label>
			<label><input type="checkbox" bind:checked={trailing} /> Trailing icon</label>
			<label><input type="checkbox" bind:checked={filled} /> Filled icons</label>
			<label
				><input type="checkbox" bind:checked={disabled} /> Disabled (also applies to matrices)</label
			>
			<label><input type="checkbox" bind:checked={wide} /> Wide text button</label>
			<label><input type="checkbox" bind:checked={rounded} /> Rounded icon button</label>
		</div>
		<div data-demo="row">
			<Button
				{label}
				{size}
				{variant}
				{color}
				{wide}
				icon={leading ? { name: 'save', filled } : undefined}
				trailingIcon={trailing ? { name: 'arrow_forward', filled } : undefined}
				stylesOverride={{ disabled, onclick: () => clicks++ }}
			/>
			<Button
				{size}
				{variant}
				{color}
				{rounded}
				icon={{ name: 'favorite', filled }}
				stylesOverride={{ disabled, 'aria-label': 'Favorite', onclick: () => clicks++ }}
			/>
		</div>
		<p role="status">Activated {clicks} times. Try Tab, Enter and Space.</p>
		<CodeSnippet
			source={`<Button label={${JSON.stringify(label)}} size="${size}" variant="${variant}" color="${color}" wide={${wide}} icon={${leading ? `{ name: 'save', filled: ${filled} }` : 'undefined'}} trailingIcon={${trailing ? `{ name: 'arrow_forward', filled: ${filled} }` : 'undefined'}} stylesOverride={{ disabled: ${disabled}, onclick: () => clicks++ }} />
<Button size="${size}" variant="${variant}" color="${color}" rounded={${rounded}} icon={{ name: 'favorite', filled: ${filled} }} stylesOverride={{ disabled: ${disabled}, 'aria-label': 'Favorite', onclick: () => clicks++ }} />`}
		/>
	</Section>
	<Section {...sections[2]}>
		<div data-demo="matrix">
			{#each variants as value (value)}
				<h3>{value}</h3>
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
								stylesOverride={{ disabled }}
							/>
							<Button
								{size}
								variant={value}
								color="primary"
								icon={{ name: 'add' }}
								stylesOverride={{ disabled, 'aria-label': `Add (${size}, ${value})` }}
							/>
							<Button
								{size}
								variant={value}
								color="primary"
								rounded
								icon={{ name: 'favorite', filled: true }}
								stylesOverride={{ disabled, 'aria-label': `Favorite (${size}, ${value})` }}
							/>
						</div>
					{/each}
				</div>
				<div data-demo="row">
					{#each colors as color (color)}
						<div data-demo="group">
							<Button {color} variant={value} label={color} stylesOverride={{ disabled }} />
							<Button
								{color}
								variant={value}
								icon={{ name: 'add' }}
								stylesOverride={{ disabled, 'aria-label': `Add (${color}, ${value})` }}
							/>
							<Button
								{color}
								variant={value}
								rounded
								icon={{ name: 'favorite', filled: true }}
								stylesOverride={{ disabled, 'aria-label': `Favorite (${color}, ${value})` }}
							/>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</Section>
	<Section {...sections[3]}><PropTable {props} /></Section>
	<Section {...sections[4]}>
		<p>
			Pass native attributes and events through <code>stylesOverride</code>, including
			<code>disabled</code>, <code>onclick</code>, form attributes, ARIA attributes,
			<code>class</code>
			and <code>style</code>.
		</p>
		<p>
			Button uses <code>type="button"</code> unless overridden. Set <code>stylesOverride.type</code>
			to <code>submit</code> or <code>reset</code> for native form actions. Button does not accept a children
			snippet or expose an element binding.
		</p>
		<div data-demo="row">
			<Button label="Disabled" stylesOverride={{ disabled: true }} />
			<Button
				label="Saving…"
				variant="filled"
				icon={{ name: 'sync' }}
				stylesOverride={{ disabled: true, 'aria-busy': true }}
			/>
			<Button
				label={pressed ? 'Selected' : 'Select'}
				stylesOverride={{ 'aria-pressed': pressed, onclick: () => (pressed = !pressed) }}
			/>
			<Button
				label="Style override"
				stylesOverride={{
					class: 'custom-button',
					style: 'font-style: italic;',
					title: 'Native title attribute'
				}}
			/>
		</div>
		<Button
			label="Full-width action"
			wide
			icon={{ name: 'save' }}
			trailingIcon={{ name: 'arrow_forward' }}
		/>
		<Button
			label="A long label that wraps on a narrow screen without losing its meaning"
			size="small"
		/>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget, event.submitter);
				submitted = `Submitted: ${data.get('message')} (${data.get('action')})`;
			}}
			onreset={() => (submitted = 'Form reset.')}
		>
			<label>Message <input name="message" value="Hello" required /></label>
			<div data-demo="row">
				<Button label="Submit" stylesOverride={{ type: 'submit', name: 'action', value: 'save' }} />
				<Button label="Reset" stylesOverride={{ type: 'reset' }} />
			</div>
		</form>
		<p role="status">{submitted}</p>
		<CodeSnippet
			source={`<Button label="Saving…" icon={{ name: 'sync' }} variant="filled" stylesOverride={{ disabled: true, 'aria-busy': true }} />
<Button label="Submit" stylesOverride={{ type: 'submit', name: 'action', value: 'save' }} />
<Button label="Reset" stylesOverride={{ type: 'reset' }} />`}
		/>
	</Section>
	<Section {...sections[5]}>
		<p>
			Use a visible label for text buttons and <code>stylesOverride['aria-label']</code> for icon-only
			buttons. Icon-only names fall back to the icon label, then its name. Rendered icons are decorative.
		</p>
		<p>
			Enter and Space activate focused buttons; disabled buttons skip keyboard navigation. Compose
			pending states through <code>stylesOverride</code> with <code>disabled</code> and
			<code>aria-busy</code>; there is no loading prop. Verify contrast when changing colors or
			surfaces.
		</p>
	</Section>
</Page>

<style>
	[data-demo='row'],
	[data-demo='controls'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}
	[data-demo='matrix'] {
		display: grid;
		gap: 1rem;
	}
	[data-demo='group'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}
	[data-demo='group'] > span {
		flex-basis: 100%;
	}
	form {
		display: grid;
		gap: 1rem;
	}
	input,
	select {
		max-width: 100%;
	}
</style>
