<script lang="ts">
	/* eslint-disable max-lines -- Keep the prop matrix and interactive examples in their documentation page. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
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
	let matrixOpen = $state(false);
	const previewLabel = $derived(label.trim() || 'Save');
	const noop = () => undefined;
	const source = `<script>
  import { Button } from 'bref';
<${'/'}script>

<Button label="Save" onClick={save} />
<Button label="Next" href="/next" color="primary" variant="filled" trailingIcon={{ name: 'arrow_forward' }} />
<Button icon={{ name: 'favorite', filled: true }} rounded onClick={favorite} stylesOverride={{ 'aria-label': 'Favorite' }} />
<Button label="Unavailable" onClick={save} disabled />`;

	const props = [
		{
			name: 'onClick / href',
			type: 'MouseEvent handler / string',
			required: true,
			default: '—',
			description: 'Use onClick for actions or href for navigation.'
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
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disables actions and navigation.'
		},
		{
			name: 'stylesOverride',
			type: 'HTMLButtonAttributes',
			required: false,
			default: 'Omitted',
			description: 'Additional native attributes.'
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
				stylesOverride={{ 'aria-label': 'Favorite' }}
			/>
			<Button label="Unavailable" onClick={noop} disabled />
		</div>
		<CodeSnippet {source} label="Button usage code" />
	</Section>
	<Section {...sections[1]}>
		<p>Change every custom prop together; text and icon-only buttons share the controls.</p>
		<div data-demo="controls">
			<label>
				Label <input bind:value={label} placeholder="Save" />
			</label>
			<label>
				Size <select bind:value={size}>
					{#each sizes as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				Variant <select bind:value={variant}>
					{#each variants as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				Color <select bind:value={color}>
					{#each colors as value (value)}<option>{value}</option>{/each}
				</select>
			</label>
			<label>
				<input type="checkbox" bind:checked={leading} />
				Leading icon
			</label>
			<label>
				<input type="checkbox" bind:checked={trailing} />
				Trailing icon
			</label>
			<label>
				<input type="checkbox" bind:checked={filled} />
				Filled icons
			</label>
			<label>
				<input type="checkbox" bind:checked={disabled} />
				Disabled
			</label>
			<label>
				<input type="checkbox" bind:checked={wide} />
				Wide text button
			</label>
			<label>
				<input type="checkbox" bind:checked={rounded} />
				Rounded icon button
			</label>
		</div>
		<div data-demo="row">
			<Button
				label={previewLabel}
				{size}
				{variant}
				{color}
				{wide}
				icon={leading ? { name: 'save', filled } : undefined}
				trailingIcon={trailing ? { name: 'arrow_forward', filled } : undefined}
				{disabled}
				onClick={() => clicks++}
			/>
			<Button
				{size}
				{variant}
				{color}
				{rounded}
				icon={{ name: 'favorite', filled }}
				{disabled}
				onClick={() => clicks++}
				stylesOverride={{ 'aria-label': 'Favorite' }}
			/>
		</div>
		<p role="status">Activated {clicks} times. Try Tab, Enter and Space.</p>
		<CodeSnippet
			label="Button playground code"
			source={`<Button label={${JSON.stringify(previewLabel)}} size="${size}" variant="${variant}" color="${color}" wide={${wide}} icon={${leading ? `{ name: 'save', filled: ${filled} }` : 'undefined'}} trailingIcon={${trailing ? `{ name: 'arrow_forward', filled: ${filled} }` : 'undefined'}} disabled={${disabled}} onClick={() => clicks++} />
<Button size="${size}" variant="${variant}" color="${color}" rounded={${rounded}} icon={{ name: 'favorite', filled: ${filled} }} disabled={${disabled}} onClick={() => clicks++} stylesOverride={{ 'aria-label': 'Favorite' }} />`}
		/>
	</Section>
	<Section {...sections[2]}>
		<div data-demo="matrix">
			<fieldset>
				<legend>Sizes</legend>
				<div data-demo="row">
					{#each sizes as size (size)}
						<Button {size} color="primary" label={size} onClick={noop} />
					{/each}
				</div>
			</fieldset>
			<fieldset>
				<legend>Variants</legend>
				<div data-demo="row">
					{#each variants as variant (variant)}
						<Button {variant} color="primary" label={variant} onClick={noop} />
					{/each}
				</div>
			</fieldset>
			<fieldset>
				<legend>Colors</legend>
				<div data-demo="row">
					{#each colors as color (color)}
						<Button {color} label={color} onClick={noop} />
					{/each}
				</div>
			</fieldset>
			<fieldset>
				<legend>Text and icon shapes</legend>
				<div data-demo="row">
					<Button color="primary" label="Save" icon={{ name: 'save' }} onClick={noop} />
					<Button
						color="primary"
						icon={{ name: 'add' }}
						onClick={noop}
						stylesOverride={{ 'aria-label': 'Add' }}
					/>
					<Button
						color="primary"
						rounded
						icon={{ name: 'favorite', filled: true }}
						onClick={noop}
						stylesOverride={{ 'aria-label': 'Favorite' }}
					/>
				</div>
			</fieldset>
		</div>
		<p>The exhaustive QA matrix is mounted only when requested.</p>
		<div data-demo="row">
			<Button
				label={matrixOpen ? 'Hide exhaustive matrix' : 'Load exhaustive matrix'}
				color="primary"
				variant="soft"
				onClick={() => (matrixOpen = !matrixOpen)}
				stylesOverride={{
					'aria-controls': 'exhaustive-button-matrix',
					'aria-expanded': matrixOpen
				}}
			/>
		</div>
		<div id="exhaustive-button-matrix">
			{#if matrixOpen}
				<div data-demo="matrix">
					{#each variants as value (value)}
						<fieldset>
							<legend>{value}: sizes and shapes</legend>
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
											stylesOverride={{ 'aria-label': `Add (${size}, ${value})` }}
										/>
										<Button
											{size}
											variant={value}
											color="primary"
											rounded
											icon={{ name: 'favorite', filled: true }}
											{disabled}
											onClick={noop}
											stylesOverride={{
												'aria-label': `Favorite (${size}, ${value})`
											}}
										/>
									</div>
								{/each}
							</div>
						</fieldset>
						<fieldset>
							<legend>{value}: colors and shapes</legend>
							<div data-demo="row">
								{#each colors as color (color)}
									<div data-demo="group">
										<Button {color} variant={value} label={color} {disabled} onClick={noop} />
										<Button
											{color}
											variant={value}
											icon={{ name: 'add' }}
											{disabled}
											onClick={noop}
											stylesOverride={{ 'aria-label': `Add (${color}, ${value})` }}
										/>
										<Button
											{color}
											variant={value}
											rounded
											icon={{ name: 'favorite', filled: true }}
											{disabled}
											onClick={noop}
											stylesOverride={{
												'aria-label': `Favorite (${color}, ${value})`
											}}
										/>
									</div>
								{/each}
							</div>
						</fieldset>
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
			for navigation. Pass other native attributes through
			<code>stylesOverride</code>
			, including form attributes, ARIA attributes,
			<code>class</code>
			and
			<code>style</code>
			.
		</p>
		<p>
			Button uses <code>type="button"</code>
			unless overridden. Set
			<code>stylesOverride.type</code>
			to
			<code>submit</code>
			or
			<code>reset</code>
			for native form actions. Button does not accept a children snippet or expose an element binding.
		</p>
		<div data-demo="row">
			<Button label="Disabled" onClick={noop} disabled />
			<Button
				label="Saving…"
				variant="filled"
				icon={{ name: 'sync' }}
				onClick={noop}
				disabled
				stylesOverride={{ 'aria-busy': true }}
			/>
			<Button
				label={pressed ? 'Selected' : 'Select'}
				onClick={() => (pressed = !pressed)}
				stylesOverride={{ 'aria-pressed': pressed }}
			/>
			<Button
				label="Style override"
				onClick={noop}
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
			onClick={noop}
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
				Message <input name="message" value="Hello" required />
			</label>
			<div data-demo="row">
				<Button
					label="Submit"
					onClick={noop}
					stylesOverride={{ type: 'submit', name: 'action', value: 'save' }}
				/>
				<Button label="Reset" onClick={noop} stylesOverride={{ type: 'reset' }} />
			</div>
		</form>
		<p role="status">{submitted}</p>
		<CodeSnippet
			label="Button native behavior code"
			source={`<Button label="Saving…" icon={{ name: 'sync' }} variant="filled" onClick={save} disabled stylesOverride={{ 'aria-busy': true }} />
<Button label="Submit" onClick={save} stylesOverride={{ type: 'submit', name: 'action', value: 'save' }} />
<Button label="Reset" onClick={reset} stylesOverride={{ type: 'reset' }} />`}
		/>
	</Section>
	<Section {...sections[5]}>
		<p>
			Use a visible label for text buttons and <code>stylesOverride['aria-label']</code>
			for icon-only buttons. Icon-only names fall back to the icon label, then its name. Rendered icons
			are decorative.
		</p>
		<p>
			Enter and Space activate focused buttons; disabled buttons skip keyboard navigation. Compose
			pending states with <code>disabled</code>
			and
			<code>stylesOverride['aria-busy']</code>
			; there is no loading prop. Verify contrast when changing colors or surfaces.
		</p>
	</Section>
</Page>

<style>
	[data-demo='row'],
	[data-demo='controls'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px;
	}
	[data-demo='controls'] > label {
		display: grid;
		gap: 12px;
		color: var(--color-muted);
	}
	[data-demo='controls'] > label:has(input[type='checkbox']) {
		grid-template-columns: 20px 1fr;
		align-items: center;
		color: var(--color-foreground);
	}
	[data-demo='matrix'] {
		display: grid;
		gap: 24px;
	}
	fieldset {
		min-width: 0;
		padding: 24px;
		border: 1px solid var(--docs-rule);
	}
	legend {
		padding-inline: 12px;
		font-weight: 600;
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
	input,
	select {
		max-width: 100%;
	}
</style>
