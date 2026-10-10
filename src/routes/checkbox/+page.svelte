<script lang="ts">
	/* eslint-disable max-lines -- Keep controls, native form behavior and fixed examples together. */
	import { Checkbox, Button, Select, TextInput } from '$lib/index.js';

	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import type { Size } from '$lib/types.js';
	import { chapter, sections } from './sections.js';

	let checked = $state(false);
	let submitted = $state('No submission yet.');
	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	let previewChecked = $state(false);
	let previewSize = $state<Size>('medium');
	let previewLabel = $state('Receive updates');
	let previewDisabled = $state(false);
	let previewRequired = $state(false);
	let previewInvalid = $state(false);
	let indeterminate = $state(false);
	const playgroundSource = $derived(`<script>
  import { Checkbox } from 'bref-ui';
  let checked = $state(${previewChecked});
<${'/'}script>

<label for="playground-checkbox">${previewLabel.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('{', '&#123;')}</label>
<Checkbox id="playground-checkbox" size=${JSON.stringify(previewSize)} bind:checked disabled={${previewDisabled}} required={${previewRequired}} aria-invalid={${previewInvalid}} indeterminate={${indeterminate}} />`);
	const resetPlayground = () => {
		previewChecked = false;
		previewSize = 'medium';
		previewLabel = 'Receive updates';
		previewDisabled = false;
		previewRequired = false;
		previewInvalid = false;
		indeterminate = false;
	};
	const props = [
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'Checkbox size from x-small through x-large.'
		},
		{
			name: 'checked',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bind to the checked state.'
		}
	];
</script>

<Page
	title={chapter}
	description="A compact checkbox with clear checked states and native form behavior."
>
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<label><Checkbox name="updates" value="yes" bind:checked /> Receive updates</label>
		<p role="status">{checked ? 'Selected' : 'Not selected'}</p>
		<CodeSnippet
			label="Checkbox usage code"
			source="&lt;label&gt;&lt;Checkbox name=&quot;updates&quot; value=&quot;yes&quot; bind:checked /&gt; Receive updates&lt;/label&gt;"
		/>
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={resetPlayground}>
			{#snippet preview()}
				<div data-demo="preview">
					<label for="playground-checkbox">{previewLabel}</label>
					<Checkbox
						id="playground-checkbox"
						size={previewSize}
						bind:checked={previewChecked}
						disabled={previewDisabled}
						required={previewRequired}
						aria-invalid={previewInvalid}
						{indeterminate}
					/>
				</div>
			{/snippet}
			{#snippet status()}<p role="status">
					{previewChecked ? 'Selected' : 'Not selected'}
				</p>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="checkbox-previewSize" label="Size">
					<Select
						id="checkbox-previewSize"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => previewSize, (next) => (previewSize = next as typeof previewSize)}
					/>
				</PlaygroundField><PlaygroundField id="checkbox-previewLabel" label="Label">
					<TextInput id="checkbox-previewLabel" bind:value={previewLabel} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="State">
				<PlaygroundField id="checkbox-previewChecked" label="Checked" toggle>
					<Checkbox id="checkbox-previewChecked" bind:checked={previewChecked} />
				</PlaygroundField>
				<PlaygroundField id="checkbox-previewDisabled" label="Disabled" toggle>
					<Checkbox id="checkbox-previewDisabled" bind:checked={previewDisabled} />
				</PlaygroundField>
				<PlaygroundField id="checkbox-previewRequired" label="Required" toggle>
					<Checkbox id="checkbox-previewRequired" bind:checked={previewRequired} />
				</PlaygroundField>
				<PlaygroundField id="checkbox-previewInvalid" label="Invalid" toggle>
					<Checkbox id="checkbox-previewInvalid" bind:checked={previewInvalid} />
				</PlaygroundField>
				<PlaygroundField id="checkbox-indeterminate" label="Indeterminate" toggle>
					<Checkbox id="checkbox-indeterminate" bind:checked={indeterminate} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'states')!}>
		<div data-demo="examples">
			{#each sizes as size (size)}
				<label><Checkbox {size} /> {size}</label>
				<label><Checkbox {size} checked /> Checked {size}</label>
			{/each}
			<label><Checkbox disabled /> Disabled</label>
			<label><Checkbox checked disabled /> Disabled checked</label>
			<label><Checkbox required /> Required</label>
			<label><Checkbox indeterminate /> Indeterminate (native state)</label>
		</div>
	</Section>
	<Section {...sections.find((section) => section.id === 'props')!}>
		<PropTable {props} />
		<p>
			Native input attributes, events, labels, validation, form values and keyboard activation are
			forwarded. Use <code>bind:checked</code>
			when needed. Native
			<code>indeterminate</code>
			sets the mixed input state; the component currently has no separate mixed-state glyph. A checked
			box submits its value; an unchecked box submits nothing.
		</p>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				submitted = `Submitted: ${new FormData(event.currentTarget).get('consent') ?? 'none'}`;
			}}
			onreset={() => (submitted = 'Form reset.')}
		>
			<label><Checkbox name="consent" value="yes" required /> Consent required</label>
			<div data-demo="examples">
				<Button label="Submit" onClick={() => undefined} type="submit" />
				<Button label="Reset" onClick={() => undefined} type="reset" />
			</div>
		</form>
		<p role="status">{submitted}</p>
	</Section>
	<Section {...sections.find((section) => section.id === 'validation-focus')!}>
		<div data-demo="examples">
			<label><Checkbox aria-invalid="true" /> Invalid unchecked</label>
			<label><Checkbox checked aria-invalid="true" /> Invalid checked</label>
			<label><Checkbox /> Keyboard focus</label>
		</div>
		<p>
			Tab through these controls to check focus. Native validation after interaction and
			aria-invalid retain a quiet error edge without hiding focus.
		</p>
	</Section>
</Page>

<style>
	[data-demo='preview'] {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-block-size: 2.75rem;
	}
	[data-demo='examples'] {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
	}
	form {
		display: grid;
		gap: 1rem;
	}
</style>
