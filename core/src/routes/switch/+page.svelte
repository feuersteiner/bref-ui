<script lang="ts">
	/* eslint-disable max-lines -- Keep controls, native form behavior and fixed examples together. */
	import { chapter, sections } from './sections.js';

	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Icon, Switch, Button, Checkbox, Select, TextInput } from '#lib/index.js';
	import type { BaseSize } from '#lib/types.js';

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	let enabled = $state(false);
	let submitted = $state('No submission yet.');
	const source = `<script>\n  import { Icon, Switch } from 'bref-ui';\n  let enabled = $state(false);\n<${'/'}script>\n\n<label>\n  <Switch name="notifications" bind:checked={enabled}>\n    {#if enabled}<Icon name="dark_mode" />{:else}<Icon name="light_mode" />{/if}\n  </Switch>\n  Notifications\n</label>`;
	let previewChecked = $state(false);
	let previewSize = $state<BaseSize>('medium');
	let previewLabel = $state('Receive updates');
	let previewDisabled = $state(false);
	let previewRequired = $state(false);
	let previewInvalid = $state(false);
	let withIcon = $state(false);
	const playgroundSource = $derived(`<script>
  import { Switch, Icon } from 'bref-ui';
  let checked = $state(${previewChecked});
<${'/'}script>

<label for="playground-switch">${previewLabel.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('{', '&#123;')}</label>
<Switch id="playground-switch" size=${JSON.stringify(previewSize)} bind:checked disabled={${previewDisabled}} required={${previewRequired}} aria-invalid={${previewInvalid}} >${withIcon ? '<Icon name="check" />' : ''}</Switch>`);
	const resetPlayground = () => {
		previewChecked = false;
		previewSize = 'medium';
		previewLabel = 'Receive updates';
		previewDisabled = false;
		previewRequired = false;
		previewInvalid = false;
		withIcon = false;
	};
	const props = [
		{
			name: 'checked',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bindable on/off state.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'small, medium or large.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: false,
			default: 'Omitted',
			description: 'Decorative content rendered inside the thumb.'
		}
	];
</script>

<Page title={chapter} description="A checkbox-based on/off control with native form behavior.">
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<label>
			<Switch name="notifications" bind:checked={enabled}>
				{#if enabled}<Icon name="dark_mode" />{:else}<Icon name="light_mode" />{/if}
			</Switch>
			Notifications
		</label>
		<p role="status">Notifications {enabled ? 'on' : 'off'}.</p>
		<CodeSnippet {source} label="Switch usage code" />
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={resetPlayground}>
			{#snippet preview()}
				<div data-demo="preview">
					<label for="playground-switch">{previewLabel}</label>
					<Switch
						id="playground-switch"
						size={previewSize}
						bind:checked={previewChecked}
						disabled={previewDisabled}
						required={previewRequired}
						aria-invalid={previewInvalid}
					>
						{#if withIcon}<Icon name="check" />{/if}
					</Switch>
				</div>
			{/snippet}
			{#snippet status()}<p role="status">
					{previewChecked ? 'Selected' : 'Not selected'}
				</p>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="switch-previewSize" label="Size">
					<Select
						id="switch-previewSize"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => previewSize, (next) => (previewSize = next as typeof previewSize)}
					/>
				</PlaygroundField><PlaygroundField id="switch-previewLabel" label="Label">
					<TextInput id="switch-previewLabel" bind:value={previewLabel} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="State">
				<PlaygroundField id="switch-previewChecked" label="Checked" toggle>
					<Checkbox id="switch-previewChecked" bind:checked={previewChecked} />
				</PlaygroundField>
				<PlaygroundField id="switch-previewDisabled" label="Disabled" toggle>
					<Checkbox id="switch-previewDisabled" bind:checked={previewDisabled} />
				</PlaygroundField>
				<PlaygroundField id="switch-previewRequired" label="Required" toggle>
					<Checkbox id="switch-previewRequired" bind:checked={previewRequired} />
				</PlaygroundField>
				<PlaygroundField id="switch-previewInvalid" label="Invalid" toggle>
					<Checkbox id="switch-previewInvalid" bind:checked={previewInvalid} />
				</PlaygroundField>
				<PlaygroundField id="switch-withIcon" label="Thumb icon" toggle>
					<Checkbox id="switch-withIcon" bind:checked={withIcon} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'states')!}>
		<div>
			{#each sizes as size (size)}
				<label><Switch {size} aria-label={`${size} switch`} /> {size}</label>
				<label><Switch {size} checked aria-label={`${size} checked switch`} /> {size} on</label>
			{/each}
			<label><Switch disabled /> Disabled</label>
			<label><Switch checked disabled /> Disabled on</label>
		</div>
	</Section>
	<Section {...sections.find((section) => section.id === 'props')!}>
		<PropTable {props} />
		<p>
			Native checkbox attributes and events are forwarded. Use a wrapping label or <code>
				aria-label
			</code>
			for an accessible name. Bind
			<code>checked</code>
			as needed. The optional children snippet renders decorative content inside the thumb; keep interactive
			elements outside the switch.
		</p>
	</Section>
	<Section {...sections.find((section) => section.id === 'native-behavior')!}>
		<p>
			Tab to focus and press Space to toggle. A named switch submits its value only while checked;
			disabled switches do not submit.
		</p>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				submitted = new FormData(event.currentTarget).get('updates')?.toString() ?? '(empty)';
			}}
		>
			<label><Switch name="updates" value="yes" required /> Receive updates (required)</label>
			<Button label="Submit" onClick={() => undefined} type="submit" />
			<Button label="Reset" onClick={() => undefined} type="reset" />
		</form>
		<p role="status">Submitted: {submitted}</p>
	</Section>
	<Section {...sections.find((section) => section.id === 'validation-focus')!}>
		<div>
			<label><Switch aria-invalid="true" /> Invalid off</label>
			<label><Switch checked aria-invalid="true" /> Invalid on</label>
			<label><Switch /> Keyboard focus</label>
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
	div {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-block-size: 2.75rem;
	}
	form {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}
</style>
