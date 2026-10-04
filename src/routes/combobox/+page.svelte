<script lang="ts">
	import { Combobox } from '$lib/index.js';
	import type { SelectOptionDataProps } from '$lib/select/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const items: SelectOptionDataProps[] = [
		{ id: 'apple', label: 'Apple', icon: { name: 'favorite' } },
		{ id: 'apricot', label: 'Apricot' },
		{ id: 'banana', label: 'Banana' },
		{ id: 'pear', label: 'Pear', disabled: true }
	];
	let value = $state<string | undefined>('banana');
	let many = $state<string[]>([]);
	let formValue = $state<string | undefined>();
	let disabled = $state(false);
	let submitted = $state('No submission yet.');
	let changes = $state(0);
	const source = `<script lang="ts">
  import { Combobox } from 'bref-ui';
  let fruit = $state<string | undefined>(); const items = [{ id: 'apple', label: 'Apple' }];
<${'/'}script>

<Combobox aria-label="Fruit" {items} bind:value={fruit} name="fruit" />`;
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
			description: 'Called when a user changes selection, not when search text changes.'
		},
		{
			name: 'placeholder / emptyMessage',
			type: 'string / { message; icon? }',
			required: false,
			default: 'Select… / No options found',
			description: 'Empty selection and empty results text.'
		},
		{
			name: 'size / variant / wide / disabled',
			type: 'BaseSize / neutral | soft / boolean',
			required: false,
			default: 'medium / soft / false',
			description: 'Control appearance, width and availability.'
		}
	];
</script>

<Page
	title={chapter}
	description="Search local option labels while selected IDs stay separate from the query."
>
	<Section {...sections[0]}>
		<Combobox aria-label="Fruit" {items} bind:value onChange={() => changes++} />
		<p role="status">Selected: {value ?? 'none'}; changes: {changes}</p>
		<CodeSnippet {source} label="Combobox usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-demo="row">
			<Combobox aria-label="Small fruit" {items} size="small" />
			<Combobox aria-label="Medium neutral fruit" {items} variant="neutral" />
			<Combobox aria-label="Large soft fruit" {items} size="large" variant="soft" />
		</div>
		<Combobox aria-label="Wide fruit" {items} wide />
		<div data-demo="row">
			<Combobox aria-label="Multiple fruit" {items} bind:value={many} />
			<label>
				<input type="checkbox" bind:checked={disabled} />
				Disabled
			</label>
			<Combobox aria-label="Disabled fruit" {items} {disabled} />
			<Combobox aria-label="Read-only fruit" {items} value="apple" readonly />
			<Combobox
				aria-label="Empty fruit"
				items={[]}
				emptyMessage={{ message: 'No fruit', icon: { name: 'search' } }}
			/>
		</div>
		<p role="status">Multiple: {many.join(', ') || 'none'}</p>
		<p>Pear is disabled. The shared theme control switches light and dark modes.</p>
	</Section>
	<Section {...sections[2]}>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				submitted = `Single: ${data.get('fruit')}; multiple: ${data.getAll('fruits').join(', ')}`;
			}}
		>
			<label for="fruit-field">Required fruit</label>
			<Combobox id="fruit-field" {items} bind:value={formValue} name="fruit" required />
			<Combobox aria-label="Fruits" {items} bind:value={many} name="fruits" />
			<div data-demo="row">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</div>
		</form>
		<p role="status">{submitted} Current value: {formValue ?? 'none'}</p>
		<p>
			Typing filters labels. Arrows move the active option, Enter selects, and Escape or blur
			restores the selection. A composition Enter does not select. Form reset restores initial IDs.
		</p>
	</Section>
	<Section {...sections[3]}>
		<PropTable {props} />
		<p>
			Supported native attributes: <code>
				id, title, autocomplete, autofocus, tabindex, readonly, name, form, required
			</code>
			. Use an external label or
			<code>aria-label / aria-labelledby</code>
			;
			<code>aria-describedby, aria-invalid, aria-errormessage</code>
			are forwarded. Supported events:
			<code>
				oninput, onkeydown, onblur, onfocus, onclick, oncompositionstart, oncompositionend
			</code>
			.
			<code>bind:value</code>
			tracks selected IDs; typed text remains private. No snippets are exposed.
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
