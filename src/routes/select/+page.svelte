<script lang="ts">
	import { Checkbox, Select } from '$lib/index.js';
	import type { SelectOptionDataProps } from '$lib/select/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const items: SelectOptionDataProps[] = [
		{ id: 'draft', label: 'Draft', icon: { name: 'edit' } },
		{ id: 'review', label: 'In review', icon: { name: 'search' } },
		{ id: 'archived', label: 'Archived', disabled: true },
		{ id: 'published', label: 'Published', icon: { name: 'check_circle' } }
	];
	const sizes = ['small', 'medium', 'large'] as const;
	const overflowItems: SelectOptionDataProps[] = Array.from({ length: 24 }, (_, index) => ({
		id: `option-${index + 1}`,
		label: `Option ${index + 1}: A long label that exceeds the available option width`,
		icon: { name: 'description' }
	}));
	let value = $state<string | undefined>();
	let many = $state<string[]>([]);
	let disabled = $state(false);
	let changeCount = $state(0);
	const source = `<script>
  import { Select } from 'bref-ui';
  let status = $state<string | undefined>();
  const items = [{ id: 'draft', label: 'Draft' }];
<${'/'}script>

<label for="status">Status</label>
<Select id="status" {items} bind:value={status} />`;
	const props = [
		{
			name: 'items',
			type: 'readonly SelectOptionDataProps[]',
			required: true,
			default: '—',
			description: 'Unique IDs, labels, optional icons and disabled state.'
		},
		{
			name: 'value',
			type: 'string | string[]',
			required: false,
			default: 'undefined',
			description: 'Bindable selected ID or IDs; an array enables multiple selection.'
		},
		{
			name: 'onChange',
			type: '(value: string | string[]) => void',
			required: false,
			default: 'Omitted',
			description: 'Called when a user changes selection.'
		},
		{
			name: 'placeholder / emptyMessage',
			type: 'string / SelectEmptyProps',
			required: false,
			default: 'Select… / No options found',
			description: 'Empty selection and empty list text.'
		},
		{
			name: 'id / size',
			type: 'string / BaseSize',
			required: false,
			default: 'Omitted / medium',
			description: 'Trigger ID for labels; control height, spacing and corner radius.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disable the trigger and close the popup.'
		}
	];
</script>

<Page title={chapter} description="Choose one or more labeled options by ID.">
	<Section {...sections[0]}>
		<label for="status">Status</label>
		<Select id="status" {items} bind:value onChange={() => changeCount++} />
		<p role="status">Selected: {value ?? 'none'}; changes: {changeCount}</p>
		<CodeSnippet {source} label="Select usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-demo="row">
			{#each sizes as size (size)}
				<div>
					<label for={`${size}-status`}>{size} status</label>
					<Select id={`${size}-status`} {items} {size} />
				</div>
			{/each}
		</div>
		<label for="multiple-statuses">Multiple statuses</label>
		<Select id="multiple-statuses" {items} bind:value={many} />
		<p role="status">Multiple: {many.join(', ') || 'none'}</p>
		<div data-demo="row">
			<label>
				<Checkbox bind:checked={disabled} />
				Disabled
			</label>
			<div>
				<label for="disabled-status">Disabled status</label>
				<Select id="disabled-status" {items} {disabled} />
			</div>
			<div>
				<label for="empty-choices">Empty choices</label>
				<Select
					id="empty-choices"
					items={[]}
					emptyMessage={{ message: 'Nothing available', icon: { name: 'search' } }}
				/>
			</div>
		</div>
		<p>Archived is disabled. The shared theme control switches light and dark modes.</p>
		<h3>Long labels and scrolling</h3>
		<label for="overflow-choices">Overflow choices</label>
		<Select id="overflow-choices" items={overflowItems} placeholder="Open 24 long options" />
		<p>
			Long labels truncate with an ellipsis. Open the list and scroll, or Tab through the options.
		</p>
	</Section>
	<Section {...sections[2]}>
		<label for="labeled-status">Status</label>
		<Select id="labeled-status" {items} bind:value placeholder="Choose a status" />
		<p>
			Enter or Space opens the popup. Tab and Shift+Tab move between option buttons; Enter or Space
			selects. Single selection closes the popup; multiple selection keeps it open. Escape or a
			click outside closes it.
		</p>
	</Section>
	<Section {...sections[3]}>
		<PropTable {props} />
		<p>
			Labels target the trigger ID. Icons accept only name and filled. Native HTML attributes and
			events are not forwarded. Selection uses bind:value and onChange; an array toggles multiple
			IDs. Form submission and reset belong to the caller; snippets are not exposed.
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
		max-width: 100%;
	}
	[data-demo='row'] > div {
		flex: 1;
		min-width: min(100%, 12rem);
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
