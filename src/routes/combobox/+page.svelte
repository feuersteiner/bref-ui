<script lang="ts">
	/* eslint-disable max-lines -- Keep the size, state and native form examples together on the documentation page. */
	import { Button, Checkbox, Combobox } from '$lib/index.js';
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
	const sizes = ['small', 'medium', 'large'] as const;
	const overflowItems: SelectOptionDataProps[] = Array.from({ length: 24 }, (_, index) => ({
		id: `option-${index + 1}`,
		label: `Option ${index + 1}: a long label that stays readable within a narrow viewport`
	}));
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
			type: 'string / SelectEmptyProps',
			required: false,
			default: 'Select… / No options found',
			description: 'Empty selection and empty results text.'
		},
		{
			name: 'size / variant / wide / disabled',
			type: 'BaseSize / neutral | soft / boolean',
			required: false,
			default: 'medium / soft / false',
			description: 'Input and option size, appearance, width and availability.'
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
			{#each sizes as size (size)}
				<div data-demo-size>
					<label for={`${size}-fruit`}>{size} fruit</label>
					<Combobox id={`${size}-fruit`} {items} {size} value="apple" wide />
				</div>
			{/each}
		</div>
		<p>
			Size applies to the input and options. Compact option rows sit in a contextual glass panel;
			the input keeps its opaque field fill.
		</p>
	</Section>
	<Section {...sections[2]}>
		<div data-demo="row">
			<div data-demo-size>
				<label for="neutral-fruit">Neutral fruit</label>
				<Combobox id="neutral-fruit" aria-label="Medium neutral fruit" {items} variant="neutral" />
			</div>
		</div>
		<label for="wide-fruit">Wide fruit</label>
		<Combobox id="wide-fruit" aria-label="Wide fruit" {items} wide />
		<div data-demo="row">
			<div data-demo-size>
				<label for="multiple-fruit">Multiple fruit</label>
				<Combobox id="multiple-fruit" aria-label="Multiple fruit" {items} bind:value={many} />
			</div>
			<label>
				<Checkbox bind:checked={disabled} />
				Disabled
			</label>
			<div data-demo-size>
				<label for="disabled-fruit">Disabled fruit</label>
				<Combobox id="disabled-fruit" aria-label="Disabled fruit" {items} {disabled} />
			</div>
			<div data-demo-size>
				<label for="readonly-fruit">Read-only fruit</label>
				<Combobox id="readonly-fruit" aria-label="Read-only fruit" {items} value="apple" readonly />
			</div>
			<div data-demo-size>
				<label for="empty-fruit">Empty fruit</label>
				<Combobox
					id="empty-fruit"
					aria-label="Empty fruit"
					items={[]}
					emptyMessage={{ message: 'No fruit', icon: { name: 'search' } }}
				/>
			</div>
		</div>
		<label for="invalid-fruit">Invalid fruit</label>
		<Combobox
			id="invalid-fruit"
			{items}
			aria-invalid="true"
			aria-describedby="invalid-fruit-help"
		/>
		<p id="invalid-fruit-help">
			An explicit aria-invalid attribute gives the visible input an error edge.
		</p>
		<p role="status">Multiple: {many.join(', ') || 'none'}</p>
		<p>Pear is disabled. The shared theme control switches light and dark modes.</p>
	</Section>
	<Section {...sections[3]}>
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
				<Button label="Submit" onClick={() => undefined} type="submit" />
				<Button label="Reset" onClick={() => undefined} type="reset" />
			</div>
		</form>
		<p role="status">{submitted} Current value: {formValue ?? 'none'}</p>
		<p>
			Typing filters labels. Arrows move the active option, Enter selects, and Escape or blur
			restores the selection. A composition Enter does not select. Form reset restores initial IDs.
			Required validation uses the hidden native form control; it does not automatically set
			aria-invalid on the visible input.
		</p>
	</Section>
	<Section {...sections[4]}>
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
	<Section {...sections[5]}>
		<label for="overflow-fruit">Long choices</label>
		<Combobox id="overflow-fruit" items={overflowItems} placeholder="Search 24 long choices" wide />
		<p>
			Long labels truncate within the panel. Arrow keys and Home or End move the active row into
			view. Selected rows keep a primary tick; hover and keyboard activity use separate tonal fills.
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
	[data-demo-size] {
		display: grid;
		gap: 0.5rem;
		flex: 1;
		align-self: flex-start;
		min-width: min(100%, 12rem);
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
