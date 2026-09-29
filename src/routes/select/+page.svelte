<script lang="ts">
	/* eslint-disable max-lines -- Keep the interactive gallery examples with their documentation. */
	import { Select } from '$lib/index.js';
	import type { SelectOption } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const options: SelectOption[] = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'review', label: 'In review' },
		{ value: 'archived', label: 'Archived', disabled: true },
		{ value: 'published', label: 'Published' }
	];
	const sizes = ['small', 'medium', 'large'] as const;
	let value = $state<string | undefined>();
	let requiredValue = $state<string | undefined>();
	let disabled = $state(false);
	let submitted = $state('No submission yet.');
	const source = `<script>
  import { Select } from 'bref-ui';
  let status = $state<string | undefined>();
  const options = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' }
  ];
<${'/'}script>

<Select aria-label="Status" {options} bind:value={status} name="status" />`;
	const props = [
		{
			name: 'options',
			type: 'readonly SelectOption[]',
			required: true,
			default: '—',
			description: 'Unique values with labels and optional disabled state.'
		},
		{
			name: 'value',
			type: 'string | undefined',
			required: false,
			default: 'undefined',
			description: 'Bindable selected option value.'
		},
		{
			name: 'name',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Form field name.'
		},
		{
			name: 'form',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'ID of an associated form.'
		},
		{
			name: 'required',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Requires a selection for form validation.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disables selection and form submission.'
		},
		{
			name: 'placeholder',
			type: 'string',
			required: false,
			default: 'Select…',
			description: 'Text shown before selection.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Small, medium or large.'
		},
		{
			name: 'id',
			type: 'string',
			required: false,
			default: 'Generated',
			description: 'Trigger ID for label association.'
		},
		{
			name: 'aria-label / aria-labelledby / aria-describedby',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Accessible name and description for the trigger and listbox.'
		}
	];
</script>

<Page title={chapter} description="A single-value listbox built on the reusable Popover.">
	<Section {...sections[0]}>
		<Select aria-label="Status" {options} bind:value />
		<p role="status">Selected: {value ?? 'none'}</p>
		<CodeSnippet {source} label="Select usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-demo="row">
			{#each sizes as size (size)}
				<Select aria-label={`${size} status`} {options} {size} />
			{/each}
		</div>
		<div data-demo="row">
			<label>
				<input type="checkbox" bind:checked={disabled} />
				Disabled
			</label>
			<Select aria-label="Toggle disabled status" {options} {disabled} />
			<Select aria-label="Empty choices" options={[]} />
		</div>
		<p>
			Archived is disabled and cannot be selected by pointer or keyboard. Use the navbar theme
			control to inspect both light and dark modes.
		</p>
	</Section>
	<Section {...sections[2]}>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				submitted = `Submitted: ${new FormData(event.currentTarget).get('status')}`;
			}}
			onreset={() => (submitted = 'Form reset.')}
		>
			<label id="required-status-label" for="required-status">Required status</label>
			<Select
				id="required-status"
				aria-labelledby="required-status-label"
				{options}
				bind:value={requiredValue}
				name="status"
				required
			/>
			<div data-demo="row">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</div>
		</form>
		<p role="status">{submitted} Current value: {requiredValue ?? 'none'}</p>
		<p>
			Focus the trigger and press Enter, Space, or an arrow key to open. In the listbox, use arrows,
			Home, End, or type letters to move; Enter or Space selects, and Escape closes. Tab follows
			native popover behavior. A named Select submits through its native select control and resets
			with its form.
		</p>
	</Section>
	<Section {...sections[3]}>
		<PropTable {props} />
		<p>
			The value is bound with <code>bind:value</code>
			. Labels can use
			<code>id</code>
			with a native label, or ARIA naming props. The options array supplies visible labels; there are
			no snippets.
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
