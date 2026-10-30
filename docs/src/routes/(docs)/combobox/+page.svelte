<script lang="ts">
	import { componentDocs } from 'bref-ui/docs';
	import ComponentUsage from '../components/component-usage.svelte';
	/* eslint-disable max-lines -- Keep the size, state and native form examples together on the documentation page. */
	import { Button, Checkbox, Combobox, Select, TextInput } from 'bref-ui';
	import type { SelectOptionDataProps, BaseSize, IconProps } from 'bref-ui/types';

	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const doc = componentDocs['combobox'];
	const props = doc.props;

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
	let previewWide = $state(false);
	let previewVariant = $state<'neutral' | 'soft'>('soft');
	let previewReadonly = $state(false);
	const variants = ['neutral', 'soft'] as const;
	const playgroundSource = $derived(`<script lang="ts">
  import { Combobox } from 'bref-ui';
  import type { SelectOptionDataProps } from 'bref-ui/types';
  const items: SelectOptionDataProps[] = ${JSON.stringify(previewItems, null, 2)};
  let value = $state<string | string[] | undefined>(${JSON.stringify(previewValue) ?? 'undefined'});
  let changes = $state(0);
<${'/'}script>

<label for="playground-combobox">Choose fruit</label>
<Combobox id="playground-combobox" {items} bind:value size=${JSON.stringify(previewSize)} disabled={${previewDisabled}} placeholder={${JSON.stringify(previewPlaceholder)}} emptyMessage={${JSON.stringify(previewEmpty)}} wide={${previewWide}} variant=${JSON.stringify(previewVariant)} readonly={${previewReadonly}} onChange={() => changes++} />
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
		previewWide = false;
		previewVariant = 'soft';
		previewReadonly = false;
	};
</script>

<Page title={chapter} description={doc.description}>
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<Combobox aria-label="Fruit" {items} bind:value onChange={() => changes++} />
		<p role="status">Selected: {value ?? 'none'}; changes: {changes}</p>
		<ComponentUsage usage={doc.usage} />
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={resetPlayground}>
			{#snippet preview()}
				<div data-demo="preview">
					<label for="playground-combobox">Choose fruit</label>
					<Combobox
						id="playground-combobox"
						items={previewItems}
						bind:value={previewValue}
						size={previewSize}
						disabled={previewDisabled}
						placeholder={previewPlaceholder}
						emptyMessage={previewEmpty}
						wide={previewWide}
						variant={previewVariant}
						readonly={previewReadonly}
						onChange={() => previewChanges++}
					/>
				</div>
			{/snippet}
			{#snippet status()}<p role="status">
					Selected: {JSON.stringify(previewValue) ?? 'none'}; changes: {previewChanges}
				</p>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="combobox-previewSize" label="Size">
					<Select
						id="combobox-previewSize"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => previewSize, (next) => (previewSize = next as typeof previewSize)}
					/>
				</PlaygroundField><PlaygroundField id="combobox-previewPlaceholder" label="Placeholder">
					<TextInput id="combobox-previewPlaceholder" bind:value={previewPlaceholder} />
				</PlaygroundField><PlaygroundField id="combobox-previewVariant" label="Variant">
					<Select
						id="combobox-previewVariant"
						items={variants.map((id) => ({ id, label: id }))}
						bind:value={
							() => previewVariant, (next) => (previewVariant = next as typeof previewVariant)
						}
					/>
				</PlaygroundField><PlaygroundField id="combobox-previewWide" label="Wide" toggle>
					<Checkbox id="combobox-previewWide" bind:checked={previewWide} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Selection">
				<PlaygroundField id="combobox-multiple" label="Multiple selection" toggle>
					<Checkbox
						id="combobox-multiple"
						checked={multiple}
						onchange={(event) => {
							multiple = event.currentTarget.checked;
							previewValue = multiple ? [] : undefined;
						}}
					/>
				</PlaygroundField><PlaygroundField id="combobox-previewDisabled" label="Disabled" toggle>
					<Checkbox id="combobox-previewDisabled" bind:checked={previewDisabled} />
				</PlaygroundField><PlaygroundField id="combobox-previewReadonly" label="Read only" toggle>
					<Checkbox id="combobox-previewReadonly" bind:checked={previewReadonly} />
				</PlaygroundField><Button
					label="Clear selection"
					size="small"
					variant="neutral"
					onClick={() => (previewValue = multiple ? [] : undefined)}
				/>
			</PlaygroundGroup>
			<PlaygroundGroup title="Options">
				<PlaygroundField id="combobox-empty" label="Empty options" toggle>
					<Checkbox id="combobox-empty" bind:checked={empty} />
				</PlaygroundField>
				<PlaygroundField id="combobox-optionIcons" label="Option icons" toggle>
					<Checkbox id="combobox-optionIcons" bind:checked={optionIcons} />
				</PlaygroundField>
				<PlaygroundField id="combobox-optionDisabled" label="Disabled option" toggle>
					<Checkbox id="combobox-optionDisabled" bind:checked={optionDisabled} />
				</PlaygroundField>
				<PlaygroundField id="combobox-emptyText" label="Empty message">
					<TextInput id="combobox-emptyText" bind:value={emptyText} />
				</PlaygroundField>
				<PlaygroundField id="combobox-emptyIcon" label="Empty message icon" toggle>
					<Checkbox id="combobox-emptyIcon" bind:checked={emptyIcon} />
				</PlaygroundField>
				<PlaygroundField id="combobox-iconName" label="Empty icon name">
					<Select
						id="combobox-iconName"
						items={iconNames.map((id) => ({ id, label: id }))}
						bind:value={() => iconName, (next) => (iconName = next as typeof iconName)}
					/>
				</PlaygroundField>
				<PlaygroundField id="combobox-iconFilled" label="Filled icons" toggle>
					<Checkbox id="combobox-iconFilled" bind:checked={iconFilled} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'sizes')!}>
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
	<Section {...sections.find((section) => section.id === 'states')!}>
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
	<Section {...sections.find((section) => section.id === 'forms')!}>
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
	<Section {...sections.find((section) => section.id === 'props')!}>
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
	<Section {...sections.find((section) => section.id === 'viewport')!}>
		<label for="overflow-fruit">Long choices</label>
		<Combobox id="overflow-fruit" items={overflowItems} placeholder="Search 24 long choices" wide />
		<p>
			Long labels truncate within the panel. Arrow keys and Home or End move the active row into
			view. Selected rows keep a primary tick; hover and keyboard activity use separate tonal fills.
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
