<script lang="ts">
	import { componentDocs } from 'bref-ui/docs';
	import ComponentUsage from '../components/component-usage.svelte';
	/* eslint-disable max-lines -- Keep the native form examples and component matrix together on the documentation page. */
	import { TextArea, Select, Checkbox, TextInput, Button } from 'bref-ui';
	import type { BaseSize, Variant, IconProps } from 'bref-ui/types';

	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import PropTable from '../components/prop-table.svelte';
	import MovingBackground from '../components/moving-background.svelte';
	import { chapter, sections } from './sections.js';

	const doc = componentDocs['text-area'];
	const props = doc.props;

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	const variants = ['neutral', 'soft'] as const;
	let value = $state('A longer message can be resized vertically.');
	let size = $state<BaseSize>('medium');
	let variant = $state<Exclude<Variant, 'filled'>>('soft');
	let wide = $state(false);
	let glass = $state(false);
	let withIcon = $state(true);
	let movingBackground = $state(false);
	let lastChange = $state('Edit the field to inspect onChange.');
	let nativeEvents = $state(0);
	let submitted = $state('Submit the form to inspect its value.');
	let resizable = $state(true);
	let rows = $state<number | undefined>(3);
	const iconNames: IconProps['name'][] = ['edit', 'favorite', 'person', 'check_circle'];
	const iconSizes = ['inherit', 'x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const iconColors = [
		'inherit',
		'primary',
		'secondary',
		'foreground',
		'background',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	] as const;
	let iconName = $state<IconProps['name']>('edit');
	let iconFilled = $state(false);
	let iconSize = $state<(typeof iconSizes)[number]>('inherit');
	let iconColor = $state<(typeof iconColors)[number]>('inherit');
	let disabled = $state(false);
	let readonly = $state(false);
	const previewIcon = $derived(
		withIcon
			? {
					name: iconName,
					filled: iconFilled,
					size: iconSize === 'inherit' ? undefined : iconSize,
					color: iconColor === 'inherit' ? undefined : iconColor
				}
			: undefined
	);
	const playgroundSource = $derived(`<script lang="ts">
  import { TextArea } from 'bref-ui';
  let value = $state(${JSON.stringify(value)});
  let lastChange = $state('Edit the field to inspect onChange.');
  let nativeEvents = $state(0);
<${'/'}script>

<label for="playground-text-area">Editable message</label>
<TextArea id="playground-text-area" size=${JSON.stringify(size)} variant=${JSON.stringify(variant)} glass={${glass}} wide={${wide}} disabled={${disabled}} readonly={${readonly}}${
		previewIcon
			? ' icon={{' +
				Object.entries(previewIcon)
					.filter(([, value]) => value !== undefined)
					.map(([key, value]) => key + ': ' + JSON.stringify(value))
					.join(', ') +
				'}}'
			: ''
	} resizable={${resizable}} rows={${rows ?? 'undefined'}} bind:value onChange={(next) => lastChange = 'TextArea: ' + next} oninput={() => nativeEvents++} />
<p role="status">{lastChange}</p>
<p>Bound value: {value}; native input events: {nativeEvents}</p>`);
	const resetPlayground = () => {
		value = 'A longer message can be resized vertically.';
		size = 'medium';
		variant = 'soft';
		wide = false;
		glass = false;
		withIcon = true;
		movingBackground = false;
		iconName = 'edit';
		iconFilled = false;
		iconSize = 'inherit';
		iconColor = 'inherit';
		disabled = false;
		readonly = false;
		lastChange = 'Edit the field to inspect onChange.';
		nativeEvents = 0;
		resizable = true;
		rows = 3;
	};
</script>

<Page title={chapter} description={doc.description}>
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<div data-demo="fields">
			<label for="usage-text-area">Message</label>
			<TextArea id="usage-text-area" name="entry" placeholder="Write a message" rows={3} />
		</div>
		<ComponentUsage usage={doc.usage} />
	</Section>

	<Section {...sections.find((section) => section.id === 'appearance')!}>
		<p>Neutral and soft variants use quiet tonal fills, with a clear indicator when focused.</p>
		<div data-demo="grid">
			{#each variants as currentVariant (currentVariant)}
				{#each sizes as currentSize (currentSize)}
					<label>
						{currentVariant}, {currentSize}<TextArea
							size={currentSize}
							variant={currentVariant}
							placeholder="Write a message"
							rows={2}
						/>
					</label>
				{/each}
			{/each}
		</div>
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={resetPlayground}>
			{#snippet preview()}
				<div data-demo="playground">
					{#if movingBackground}<MovingBackground />{/if}
					<div data-demo="fields">
						<label for="playground-text-area">Editable message</label>
						<TextArea
							id="playground-text-area"
							{size}
							{variant}
							{glass}
							{wide}
							{disabled}
							{readonly}
							icon={previewIcon}
							bind:value
							onChange={(next) => (lastChange = `TextArea: ${next}`)}
							oninput={() => nativeEvents++}
							{resizable}
							{rows}
						/>
					</div>
				</div>
			{/snippet}
			{#snippet status()}<p role="status">{lastChange}</p>
				<p>Bound value: {value}; native input events: {nativeEvents}</p>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="text-area-size" label="Size">
					<Select
						id="text-area-size"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => size, (next) => (size = next as typeof size)}
					/>
				</PlaygroundField>
				<PlaygroundField id="text-area-variant" label="Variant">
					<Select
						id="text-area-variant"
						items={variants.map((id) => ({ id, label: id }))}
						bind:value={() => variant, (next) => (variant = next as typeof variant)}
					/>
				</PlaygroundField>
				<PlaygroundField id="text-area-glass" label="Glass" toggle>
					<Checkbox id="text-area-glass" bind:checked={glass} />
				</PlaygroundField>
				<PlaygroundField id="text-area-wide" label="Wide" toggle>
					<Checkbox id="text-area-wide" bind:checked={wide} />
				</PlaygroundField>
				<PlaygroundField id="text-area-resizable" label="Resizable" toggle>
					<Checkbox id="text-area-resizable" bind:checked={resizable} />
				</PlaygroundField>
				<PlaygroundField id="text-area-rows" label="Rows">
					<TextInput
						id="text-area-rows"
						type="number"
						min={1}
						max={10}
						bind:value={
							() => (rows == null ? '' : String(rows)),
							(next) => (rows = next === '' ? undefined : Math.max(1, Math.min(10, Number(next))))
						}
					/>
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Icon">
				<PlaygroundField id="text-area-withIcon" label="Leading icon" toggle>
					<Checkbox id="text-area-withIcon" bind:checked={withIcon} />
				</PlaygroundField>
				<PlaygroundField id="text-area-iconName" label="Icon name">
					<Select
						id="text-area-iconName"
						items={iconNames.map((id) => ({ id, label: id }))}
						bind:value={() => iconName, (next) => (iconName = next as typeof iconName)}
					/>
				</PlaygroundField>
				<PlaygroundField id="text-area-iconFilled" label="Filled icon" toggle>
					<Checkbox id="text-area-iconFilled" bind:checked={iconFilled} />
				</PlaygroundField>
				<PlaygroundField id="text-area-iconSize" label="Icon size">
					<Select
						id="text-area-iconSize"
						items={iconSizes.map((id) => ({ id, label: id }))}
						bind:value={() => iconSize, (next) => (iconSize = next as typeof iconSize)}
					/>
				</PlaygroundField>
				<PlaygroundField id="text-area-iconColor" label="Icon color">
					<Select
						id="text-area-iconColor"
						items={iconColors.map((id) => ({ id, label: id }))}
						bind:value={() => iconColor, (next) => (iconColor = next as typeof iconColor)}
					/>
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="State and preview">
				<PlaygroundField id="text-area-disabled" label="Disabled" toggle>
					<Checkbox id="text-area-disabled" bind:checked={disabled} />
				</PlaygroundField>
				<PlaygroundField id="text-area-readonly" label="Read only" toggle>
					<Checkbox id="text-area-readonly" bind:checked={readonly} />
				</PlaygroundField>
				<PlaygroundField id="text-area-movingBackground" label="Moving background" toggle>
					<Checkbox id="text-area-movingBackground" bind:checked={movingBackground} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'native-behavior')!}>
		<p>
			Native labels, IDs, names, constraints, events, form association and ARIA attributes pass
			through to the textarea. Use <code>bind:value</code>
			for its string value. No content snippet is used. The optional leading icon is decorative. Native
			<code>rows</code>
			,
			<code>cols</code>
			,
			<code>wrap</code>
			, lengths and
			<code>defaultValue</code>
			are supported.
		</p>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				submitted = `Submitted: ${data.get('entry')}`;
			}}
			onreset={() => (submitted = 'Form reset.')}
		>
			<label for="form-text-area">Note</label>
			<TextArea id="form-text-area" name="entry" value="Initial note" required rows={2} />
			<div data-demo="actions">
				<Button label="Submit" onClick={() => undefined} type="submit" />
				<Button label="Reset" onClick={() => undefined} type="reset" />
			</div>
		</form>
		<p role="status">{submitted}</p>
		<div data-demo="grid">
			<label>Disabled<TextArea disabled value="Unavailable" icon={{ name: 'edit' }} /></label>
			<label>Read only<TextArea readonly value="Fixed value" /></label>
			<label>Required and empty<TextArea required aria-describedby="required-help" /></label>
			<label>
				Server error<TextArea aria-invalid="true" aria-describedby="error-help" value="Incorrect" />
			</label>
		</div>
		<p id="required-help">
			Required fields use native validation on submission. Error styling follows native
			<code>:user-invalid</code>
			after interaction or submission; untouched required fields stay quiet. Use
			<code>aria-invalid="true"</code>
			for application errors.
		</p>
		<p id="error-help">This entry was not accepted. Check the value and try again.</p>
	</Section>
	<Section {...sections.find((section) => section.id === 'props')!}><PropTable {props} /></Section>
</Page>

<style>
	[data-demo='playground'] {
		position: relative;
		isolation: isolate;
		display: grid;
		align-items: center;
		min-block-size: 240px;
		padding: 24px;
	}
	[data-demo='playground'] > [data-demo='fields'] {
		position: relative;
		z-index: 1;
	}
	[data-demo='fields'],
	form {
		display: grid;
		gap: 12px;
		max-width: 32rem;
	}
	[data-demo='grid'] {
		display: grid;
		align-items: start;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: 20px;
	}
	[data-demo='grid'] label {
		display: grid;
		gap: 8px;
	}
	[data-demo='actions'] {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		margin-block: 24px;
	}
</style>
