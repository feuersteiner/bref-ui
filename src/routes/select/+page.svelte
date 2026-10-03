<script lang="ts">
	import { Select } from '$lib/index.js';
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
	let value = $state<string | undefined>();
	let many = $state<string[]>([]);
	let requiredValue = $state<string | undefined>();
	let disabled = $state(false);
	let submitted = $state('No submission yet.');
	let changeCount = $state(0);
	const source = `<script>
  import { Select } from 'bref-ui';
  let status = $state<string | undefined>();
  const items = [{ id: 'draft', label: 'Draft' }];
<${'/'}script>

<Select aria-label="Status" {items} bind:value={status} name="status" />`;
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
			type: 'string / { message; icon? }',
			required: false,
			default: 'Select… / No options found',
			description: 'Empty selection and empty list text.'
		},
		{
			name: 'size / variant / wide',
			type: 'BaseSize / neutral | soft / boolean',
			required: false,
			default: 'medium / soft / false',
			description: 'Control appearance and width.'
		},
		{
			name: 'name / form / required / disabled',
			type: 'native select attributes',
			required: false,
			default: 'Omitted',
			description: 'Form association, validation and availability.'
		}
	];
</script>

<Page title={chapter} description="Choose one or more labeled options by ID.">
	<Section {...sections[0]}>
		<Select aria-label="Status" {items} bind:value onChange={() => changeCount++} />
		<p role="status">Selected: {value ?? 'none'}; changes: {changeCount}</p>
		<CodeSnippet {source} label="Select usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-demo="row">
			{#each sizes as size (size)}<Select aria-label={`${size} status`} {items} {size} />{/each}
		</div>
		<div data-demo="row">
			<Select aria-label="Soft status" {items} variant="soft" wide />
			<Select aria-label="Multiple statuses" {items} bind:value={many} />
		</div>
		<p role="status">Multiple: {many.join(', ') || 'none'}</p>
		<div data-demo="row">
			<label>
				<input type="checkbox" bind:checked={disabled} />
				Disabled
			</label>
			<Select aria-label="Disabled status" {items} {disabled} />
			<Select
				aria-label="Empty choices"
				items={[]}
				emptyMessage={{ message: 'Nothing available', icon: { name: 'search' } }}
			/>
		</div>
		<p>Archived is disabled. The shared theme control switches light and dark modes.</p>
	</Section>
	<Section {...sections[2]}>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				submitted = `Single: ${data.get('status')}; multiple: ${data.getAll('statuses').join(', ')}`;
			}}
		>
			<label for="required-status">Required status</label>
			<Select id="required-status" {items} bind:value={requiredValue} name="status" required />
			<Select aria-label="Statuses" {items} bind:value={many} name="statuses" />
			<div data-demo="row">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</div>
		</form>
		<p role="status">{submitted} Current value: {requiredValue ?? 'none'}</p>
		<p>
			Enter or Space opens the list. Arrows, Home, End and typing move the active option; Enter or
			Space selects. Escape closes. Native form submission and reset use selected IDs.
		</p>
	</Section>
	<Section {...sections[3]}>
		<PropTable {props} />
		<p>
			Native select attributes and events are forwarded to the backing select. Labels target the
			trigger ID. Selection uses <code>bind:value</code>
			; no snippets are exposed.
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
	[data-demo='row'] > :global(*) {
		min-width: 0;
	}
	form {
		display: grid;
		gap: 1rem;
		justify-items: start;
		max-width: 100%;
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
