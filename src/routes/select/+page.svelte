<script lang="ts">
	/* eslint-disable max-lines -- Keep the selection and overflow regression demos together. */
	import { Checkbox, Select, TextInput, Button } from '$lib/index.js';
	import type { SelectOptionDataProps, BaseSize, IconProps } from '$lib/types.js';

	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
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
	let overflowMany = $state<string[]>(['option-1', 'option-2', 'option-3']);
	let disabled = $state(false);
	let changeCount = $state(0);
	const source = `<script>
  import { Select } from 'bref-ui';
  let status = $state<string | undefined>();
  const items = [{ id: 'draft', label: 'Draft' }];
<${'/'}script>

<label for="status">Status</label>
<Select id="status" {items} bind:value={status} />`;

	let previewValue = $state<string | string[] | undefined>();
	let previewSize = $state<BaseSize>('medium');
	let previewDisabled = $state(false);
	let multiple = $state(false);
	let empty = $state(false);
	let previewPlaceholder = $state('Select…');
	let emptyText = $state('No options found');
	let emptyIcon = $state(true);
	let iconFilled = $state(false);
	let iconName = $state<IconProps['name']>('search');
	const iconNames: IconProps['name'][] = ['search', 'favorite', 'description', 'check_circle'];
	let optionIcons = $state(true);
	let optionDisabled = $state(true);
	let previewChanges = $state(0);
	const previewItems = $derived(
		empty
			? []
			: items.map((item) => ({
					...item,
					icon: optionIcons && item.icon ? { ...item.icon, filled: iconFilled } : undefined,
					disabled: optionDisabled && item.disabled
				}))
	);
	const previewEmpty = $derived({
		message: emptyText,
		icon: emptyIcon ? { name: iconName, filled: iconFilled } : undefined
	});
	const playgroundSource = $derived(`<script lang="ts">
  import { Select } from 'bref-ui';
  import type { SelectOptionDataProps } from 'bref-ui/types';
  const items: SelectOptionDataProps[] = ${JSON.stringify(previewItems, null, 2)};
  let value = $state<string | string[] | undefined>(${JSON.stringify(previewValue) ?? 'undefined'});
  let changes = $state(0);
<${'/'}script>

<label for="playground-select">Choose status</label>
<Select id="playground-select" {items} bind:value size=${JSON.stringify(previewSize)} disabled={${previewDisabled}} placeholder={${JSON.stringify(previewPlaceholder)}} emptyMessage={${JSON.stringify(previewEmpty)}} onChange={() => changes++} />
<p role="status">Selected: {JSON.stringify(value) ?? 'none'}; changes: {changes}</p>`);
	const resetPlayground = () => {
		previewValue = undefined;
		previewSize = 'medium';
		previewDisabled = false;
		multiple = false;
		empty = false;
		previewPlaceholder = 'Select…';
		emptyText = 'No options found';
		emptyIcon = true;
		iconFilled = false;
		iconName = 'search';
		optionIcons = true;
		optionDisabled = true;
		previewChanges = 0;
	};
	const props = [
		{
			name: 'items',
			type: 'readonly SelectOptionDataProps[]',
			required: true,
			default: '\u2014',
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
			name: 'id',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Trigger ID for label association.'
		},
		{
			name: 'placeholder',
			type: 'string',
			required: false,
			default: 'Select\u2026',
			description: 'Text shown for an empty selection.'
		},
		{
			name: 'emptyMessage',
			type: 'SelectEmptyProps',
			required: false,
			default: "{ message: 'No options found' }",
			description: 'Empty results text and optional decorative icon.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Control and option size.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disable the control and close the popup.'
		}
	];
</script>

<Page title={chapter} description="Choose one or more labeled options by ID.">
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<label for="status">Status</label>
		<Select id="status" {items} bind:value onChange={() => changeCount++} />
		<p role="status">Selected: {value ?? 'none'}; changes: {changeCount}</p>
		<CodeSnippet {source} label="Select usage code" />
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={resetPlayground}>
			{#snippet preview()}
				<div data-demo="preview">
					<label for="playground-select">Choose status</label>
					<Select
						id="playground-select"
						items={previewItems}
						bind:value={previewValue}
						size={previewSize}
						disabled={previewDisabled}
						placeholder={previewPlaceholder}
						emptyMessage={previewEmpty}
						onChange={() => previewChanges++}
					/>
				</div>
			{/snippet}
			{#snippet status()}<p role="status">
					Selected: {JSON.stringify(previewValue) ?? 'none'}; changes: {previewChanges}
				</p>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="select-previewSize" label="Size">
					<Select
						id="select-previewSize"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => previewSize, (next) => (previewSize = next as typeof previewSize)}
					/>
				</PlaygroundField><PlaygroundField id="select-previewPlaceholder" label="Placeholder">
					<TextInput id="select-previewPlaceholder" bind:value={previewPlaceholder} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Selection">
				<PlaygroundField id="select-multiple" label="Multiple selection" toggle>
					<Checkbox
						id="select-multiple"
						checked={multiple}
						onchange={(event) => {
							multiple = event.currentTarget.checked;
							previewValue = multiple ? [] : undefined;
						}}
					/>
				</PlaygroundField><PlaygroundField id="select-previewDisabled" label="Disabled" toggle>
					<Checkbox id="select-previewDisabled" bind:checked={previewDisabled} />
				</PlaygroundField><Button
					label="Clear selection"
					size="small"
					variant="neutral"
					onClick={() => (previewValue = multiple ? [] : undefined)}
				/>
			</PlaygroundGroup>
			<PlaygroundGroup title="Options">
				<PlaygroundField id="select-empty" label="Empty options" toggle>
					<Checkbox id="select-empty" bind:checked={empty} />
				</PlaygroundField>
				<PlaygroundField id="select-optionIcons" label="Option icons" toggle>
					<Checkbox id="select-optionIcons" bind:checked={optionIcons} />
				</PlaygroundField>
				<PlaygroundField id="select-optionDisabled" label="Disabled option" toggle>
					<Checkbox id="select-optionDisabled" bind:checked={optionDisabled} />
				</PlaygroundField>
				<PlaygroundField id="select-emptyText" label="Empty message">
					<TextInput id="select-emptyText" bind:value={emptyText} />
				</PlaygroundField>
				<PlaygroundField id="select-emptyIcon" label="Empty message icon" toggle>
					<Checkbox id="select-emptyIcon" bind:checked={emptyIcon} />
				</PlaygroundField>
				<PlaygroundField id="select-iconName" label="Empty icon name">
					<Select
						id="select-iconName"
						items={iconNames.map((id) => ({ id, label: id }))}
						bind:value={() => iconName, (next) => (iconName = next as typeof iconName)}
					/>
				</PlaygroundField>
				<PlaygroundField id="select-iconFilled" label="Filled icons" toggle>
					<Checkbox id="select-iconFilled" bind:checked={iconFilled} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'states')!}>
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
		<p>Long labels truncate. Selected rows keep a tick; hover uses a neutral fill.</p>
		<div data-demo="narrow">
			<label for="multiple-overflow">Multiple long labels with icons</label>
			<Select id="multiple-overflow" items={overflowItems} bind:value={overflowMany} />
		</div>
	</Section>
	<Section {...sections.find((section) => section.id === 'keyboard')!}>
		<label for="labeled-status">Status</label>
		<Select id="labeled-status" {items} bind:value placeholder="Choose a status" />
		<p>
			Enter or Space opens the popup. Tab and Shift+Tab move between option buttons; Enter or Space
			selects. Single selection closes the popup; multiple selection keeps it open. Escape or a
			click outside closes it. Arrow navigation is not implemented; the scroll container is also a
			Tab stop.
		</p>
	</Section>
	<Section {...sections.find((section) => section.id === 'props')!}>
		<PropTable {props} />
		<p>
			Labels target the trigger ID. Icons accept only name and filled. Native HTML attributes and
			events are not forwarded. Selection uses bind:value and onChange; an array toggles multiple
			IDs. Form submission and reset belong to the caller; snippets are not exposed.
		</p>
	</Section>
</Page>

<style>
	[data-demo='preview'] {
		display: grid;
		gap: 12px;
		width: 100%;
		max-width: 24rem;
		margin-inline: auto;
	}
	[data-demo='narrow'] {
		display: grid;
		gap: 0.5rem;
		width: min(100%, 16rem);
		min-width: 0;
	}
	[data-demo='row'] {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 1rem;
		margin-block: 1rem;
		max-width: 100%;
	}
	[data-demo='row'] > div {
		display: grid;
		gap: 0.5rem;
		flex: 1;
		min-width: min(100%, 12rem);
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
