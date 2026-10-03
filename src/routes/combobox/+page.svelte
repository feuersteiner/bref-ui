<script lang="ts">
	import { Combobox } from '$lib/index.js';
	import type { SelectOption } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const options: SelectOption[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'apricot', label: 'Apricot' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'pear', label: 'Pear', disabled: true }
	];
	let value = $state<string | undefined>('banana');
	let formValue = $state<string | undefined>();
	let disabled = $state(false);
	let submitted = $state('No submission yet.');
	const source = `<script>
  import { Combobox } from 'bref-ui';
  let fruit = $state<string | undefined>();
  const options = [{ value: 'apple', label: 'Apple' }];
<${'/'}script>

<Combobox aria-label="Fruit" {options} bind:value={fruit} name="fruit" />`;
	const props = [
		{
			name: 'options',
			type: 'readonly SelectOption[]',
			required: true,
			default: '—',
			description: 'Unique committed values and labels.'
		},
		{
			name: 'value',
			type: 'string | undefined',
			required: false,
			default: 'undefined',
			description: 'Bindable committed option value.'
		},
		{
			name: 'filter',
			type: 'boolean',
			required: false,
			default: 'true',
			description: 'Set false when options are already filtered remotely.'
		},
		{
			name: 'loading / error / emptyMessage',
			type: 'boolean / string / string',
			required: false,
			default: 'false / omitted / No options found',
			description: 'Caller-owned result states.'
		},
		{
			name: 'name / form / required / disabled',
			type: 'native form props',
			required: false,
			default: 'omitted / omitted / false / false',
			description: 'Form association, validation, and availability.'
		},
		{
			name: 'size / variant',
			type: 'BaseSize / neutral | soft',
			required: false,
			default: 'medium / neutral',
			description: 'Input appearance.'
		},
		{
			name: 'id / placeholder',
			type: 'string',
			required: false,
			default: 'generated / Select…',
			description: 'Label target and empty text.'
		}
	];
</script>

<Page
	title={chapter}
	description="Search a closed list while keeping the query separate from the selected value."
>
	<Section {...sections[0]}>
		<Combobox aria-label="Fruit" {options} bind:value />
		<p role="status">Selected: {value ?? 'none'}</p>
		<CodeSnippet {source} label="Combobox usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-demo="row">
			<Combobox aria-label="Small fruit" {options} size="small" />
			<Combobox aria-label="Large soft fruit" {options} size="large" variant="soft" />
		</div>
		<label>
			<input type="checkbox" bind:checked={disabled} />
			Disabled
		</label>
		<div data-demo="row">
			<Combobox aria-label="Disabled fruit" {options} {disabled} />
			<Combobox aria-label="Empty fruit" options={[]} />
			<Combobox aria-label="Loading fruit" options={[]} loading />
			<Combobox aria-label="Failed fruit" options={[]} error="Could not load options." />
		</div>
		<p>Pear is disabled. Use the shared theme control to inspect light and dark modes.</p>
	</Section>
	<Section {...sections[2]}>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				submitted = `Submitted: ${new FormData(event.currentTarget).get('fruit')}`;
			}}
		>
			<label for="fruit-field">Required fruit</label>
			<Combobox id="fruit-field" {options} bind:value={formValue} name="fruit" required />
			<div data-demo="row">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</div>
		</form>
		<p role="status">{submitted} Current value: {formValue ?? 'none'}</p>
		<p>
			Type to filter; Up and Down move the active option, Enter selects, and Escape or blur restores
			the committed label. Composition Enter does not select. Tab leaves the field. Form reset
			restores the initial value.
		</p>
	</Section>
	<Section {...sections[3]}>
		<PropTable {props} />
		<p>
			Native input attributes and events are forwarded. Use an associated label or ARIA name. <code>
				bind:value
			</code>
			tracks the committed option; typed text is a temporary query. No snippets are exposed.
		</p>
	</Section>
</Page>

<style>
	[data-demo='row'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin-block: 1rem;
	}
	form {
		display: grid;
		gap: 1rem;
		justify-items: start;
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
