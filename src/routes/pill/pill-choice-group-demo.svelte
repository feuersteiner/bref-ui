<script lang="ts">
	import { PillChoiceGroup } from '$lib/index.js';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';

	const items = [
		{ id: 'focus', label: 'Focus' },
		{ id: 'calm', label: 'Calm' },
		{ id: 'energy', label: 'Energy' }
	];
	let mood = $state(['focus']);
	let filters = $state(['focus', 'calm']);
	let submitted = $state('');
	const props = [
		{
			name: 'items',
			type: 'readonly PillGroupItem[]',
			required: true,
			default: '—',
			description: 'Choices with unique IDs and visible labels.'
		},
		{
			name: 'label',
			type: 'string',
			required: true,
			default: '—',
			description: 'Accessible group name.'
		},
		{
			name: 'selection',
			type: "'single' | 'multiple'",
			required: false,
			default: 'single',
			description: 'Radio or checkbox selection.'
		},
		{
			name: 'selectedIds',
			type: 'string[]',
			required: false,
			default: '[]',
			description: 'Bindable selected IDs.'
		},
		{
			name: 'name',
			type: 'string',
			required: false,
			default: 'Generated for single',
			description: 'Form field name.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disable every choice.'
		},
		{ name: 'size', type: 'Size', required: false, default: 'medium', description: 'Pill size.' },
		{
			name: 'variant',
			type: 'Variant',
			required: false,
			default: 'neutral',
			description: 'Unselected Pill variant.'
		},
		{
			name: 'ref',
			type: 'HTMLUListElement',
			required: false,
			default: 'Omitted',
			description: 'Bind to the native group element.'
		}
	];
</script>

<fieldset>
	<legend>PillChoiceGroup</legend>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			const data = new FormData(event.currentTarget);
			submitted = [...data.entries()].map(([key, value]) => `${key}: ${value}`).join(', ');
		}}
	>
		<div data-choice-demo>
			<PillChoiceGroup {items} label="Mood" name="mood" bind:selectedIds={mood} />
			<p>Single selection: {mood.join(', ') || 'none'}</p>
		</div>
		<div data-choice-demo>
			<PillChoiceGroup
				{items}
				label="Filters"
				name="filters"
				selection="multiple"
				bind:selectedIds={filters}
			/>
			<p>Multiple selection: {filters.join(', ') || 'none'}</p>
		</div>
		<div data-choice-demo>
			<PillChoiceGroup {items} label="Unavailable choices" disabled selectedIds={['calm']} />
		</div>
		<div data-actions>
			<button type="submit">Submit choices</button>
			<button type="reset">Reset choices</button>
		</div>
		<p>Submitted: {submitted || 'none'}</p>
	</form>
</fieldset>
<PropTable {props} />
<CodeSnippet
	label="PillChoiceGroup usage code"
	source={`<script>\n  import { PillChoiceGroup } from 'bref-ui';\n  const items = [{ id: 'focus', label: 'Focus' }, { id: 'calm', label: 'Calm' }];\n  let selectedIds = $state(['focus']);\n<${'/'}script>\n\n<PillChoiceGroup {items} label="Mood" name="mood" bind:selectedIds />`}
/>
<p>
	PillChoiceGroup needs a label and items with unique IDs. Selection defaults to one radio choice;
	set selection to multiple for checkboxes. Bind selectedIds to hold the selection. The optional
	name sets the submitted form field. Single mode otherwise generates a name for native arrow keys.
	Disabled, size, variant, native list attributes and bind:ref are supported. Tab enters the single
	choice set; arrow keys change its selection. Space selects a radio or toggles a checkbox.
</p>

<style>
	fieldset {
		display: grid;
		gap: 1.5rem;
		margin-block: 1.5rem;
		padding: 1.5rem;
		border: 1px solid var(--docs-rule);
	}
	legend {
		padding-inline: 0.5rem;
	}
	[data-choice-demo] {
		display: grid;
		gap: 0.5rem;
	}
	form {
		display: grid;
		gap: 1.5rem;
	}
	[data-actions] {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	p {
		margin: 0;
	}
</style>
