<script lang="ts">
	import { componentDocs } from 'bref-ui/docs';
	import ComponentUsage from '../components/component-usage.svelte';
	/* eslint-disable max-lines -- Keep the native form examples and component matrix together on the documentation page. */
	import { TextInput, Select, Checkbox, Button } from 'bref-ui';
	import type { BaseSize, Variant, IconProps } from 'bref-ui/types';

	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import PropTable from '../components/prop-table.svelte';
	import MovingBackground from '../components/moving-background.svelte';
	import { chapter, sections } from './sections.js';

	const doc = componentDocs['text-input'];
	const props = doc.props;

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	const variants = ['neutral', 'soft'] as const;
	let value = $state('Hello');
	let size = $state<BaseSize>('medium');
	let variant = $state<Exclude<Variant, 'filled'>>('soft');
	let wide = $state(false);
	let glass = $state(false);
	let withIcon = $state(true);
	let movingBackground = $state(false);
	let lastChange = $state('Edit the field to inspect onChange.');
	let nativeEvents = $state(0);
	let submitted = $state('Submit the form to inspect its value.');
	const types = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'] as const;
	let number = $state('12');
	const iconNames: IconProps['name'][] = ['search', 'favorite', 'person', 'check_circle'];
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
	let iconName = $state<IconProps['name']>('search');
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
  import { TextInput } from 'bref-ui';
  let value = $state(${JSON.stringify(value)});
  let lastChange = $state('Edit the field to inspect onChange.');
  let nativeEvents = $state(0);
<${'/'}script>

<label for="playground-text-input">Editable input</label>
<TextInput id="playground-text-input" size=${JSON.stringify(size)} variant=${JSON.stringify(variant)} glass={${glass}} wide={${wide}} disabled={${disabled}} readonly={${readonly}}${
		previewIcon
			? ' icon={{' +
				Object.entries(previewIcon)
					.filter(([, value]) => value !== undefined)
					.map(([key, value]) => key + ': ' + JSON.stringify(value))
					.join(', ') +
				'}}'
			: ''
	} bind:value onChange={(next) => lastChange = 'TextInput: ' + next} oninput={() => nativeEvents++} />
<p role="status">{lastChange}</p>
<p>Bound value: {value}; native input events: {nativeEvents}</p>`);
	const resetPlayground = () => {
		value = 'Hello';
		size = 'medium';
		variant = 'soft';
		wide = false;
		glass = false;
		withIcon = true;
		movingBackground = false;
		iconName = 'search';
		iconFilled = false;
		iconSize = 'inherit';
		iconColor = 'inherit';
		disabled = false;
		readonly = false;
		lastChange = 'Edit the field to inspect onChange.';
		nativeEvents = 0;
	};
</script>

<Page title={chapter} description={doc.description}>
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<div data-demo="fields">
			<label for="usage-text-input">Name</label>
			<TextInput id="usage-text-input" name="entry" placeholder="Your name" />
		</div>
		<ComponentUsage usage={doc.usage} />
	</Section>
	<Section {...sections.find((section) => section.id === 'types')!}>
		<div data-demo="grid">
			{#each types as type (type)}<label>
					{type}<TextInput {type} placeholder={type} />
				</label>{/each}
			<label>
				String value from number input<TextInput
					type="number"
					min={0}
					max={100}
					step={1}
					bind:value={number}
				/>
			</label>
		</div>
		<p>Number input value: {number}</p>
	</Section>
	<Section {...sections.find((section) => section.id === 'appearance')!}>
		<p>Neutral and soft variants use quiet tonal fills, with a clear indicator when focused.</p>
		<div data-demo="grid">
			{#each variants as currentVariant (currentVariant)}
				{#each sizes as currentSize (currentSize)}
					<label>
						{currentVariant}, {currentSize}<TextInput
							size={currentSize}
							variant={currentVariant}
							placeholder="Your name"
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
						<label for="playground-text-input">Editable input</label>
						<TextInput
							id="playground-text-input"
							{size}
							{variant}
							{glass}
							{wide}
							{disabled}
							{readonly}
							icon={previewIcon}
							bind:value
							onChange={(next) => (lastChange = `TextInput: ${next}`)}
							oninput={() => nativeEvents++}
						/>
					</div>
				</div>
			{/snippet}
			{#snippet status()}<p role="status">{lastChange}</p>
				<p>Bound value: {value}; native input events: {nativeEvents}</p>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="text-input-size" label="Size">
					<Select
						id="text-input-size"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => size, (next) => (size = next as typeof size)}
					/>
				</PlaygroundField>
				<PlaygroundField id="text-input-variant" label="Variant">
					<Select
						id="text-input-variant"
						items={variants.map((id) => ({ id, label: id }))}
						bind:value={() => variant, (next) => (variant = next as typeof variant)}
					/>
				</PlaygroundField>
				<PlaygroundField id="text-input-glass" label="Glass" toggle>
					<Checkbox id="text-input-glass" bind:checked={glass} />
				</PlaygroundField>
				<PlaygroundField id="text-input-wide" label="Wide" toggle>
					<Checkbox id="text-input-wide" bind:checked={wide} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Icon">
				<PlaygroundField id="text-input-withIcon" label="Leading icon" toggle>
					<Checkbox id="text-input-withIcon" bind:checked={withIcon} />
				</PlaygroundField>
				<PlaygroundField id="text-input-iconName" label="Icon name">
					<Select
						id="text-input-iconName"
						items={iconNames.map((id) => ({ id, label: id }))}
						bind:value={() => iconName, (next) => (iconName = next as typeof iconName)}
					/>
				</PlaygroundField>
				<PlaygroundField id="text-input-iconFilled" label="Filled icon" toggle>
					<Checkbox id="text-input-iconFilled" bind:checked={iconFilled} />
				</PlaygroundField>
				<PlaygroundField id="text-input-iconSize" label="Icon size">
					<Select
						id="text-input-iconSize"
						items={iconSizes.map((id) => ({ id, label: id }))}
						bind:value={() => iconSize, (next) => (iconSize = next as typeof iconSize)}
					/>
				</PlaygroundField>
				<PlaygroundField id="text-input-iconColor" label="Icon color">
					<Select
						id="text-input-iconColor"
						items={iconColors.map((id) => ({ id, label: id }))}
						bind:value={() => iconColor, (next) => (iconColor = next as typeof iconColor)}
					/>
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="State and preview">
				<PlaygroundField id="text-input-disabled" label="Disabled" toggle>
					<Checkbox id="text-input-disabled" bind:checked={disabled} />
				</PlaygroundField>
				<PlaygroundField id="text-input-readonly" label="Read only" toggle>
					<Checkbox id="text-input-readonly" bind:checked={readonly} />
				</PlaygroundField>
				<PlaygroundField id="text-input-movingBackground" label="Moving background" toggle>
					<Checkbox id="text-input-movingBackground" bind:checked={movingBackground} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'native-behavior')!}>
		<p>
			Native labels, IDs, names, constraints, events, form association and ARIA attributes pass
			through to the input. Use <code>bind:value</code>
			for its string value. No content snippet is used. The optional leading icon is decorative. Number
			inputs also expose a string value, including an empty string when cleared.
		</p>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				submitted = `Submitted: ${data.get('entry')}`;
			}}
			onreset={() => (submitted = 'Form reset.')}
		>
			<label for="form-text-input">Email</label>
			<TextInput id="form-text-input" name="entry" value="name@example.com" required type="email" />
			<div data-demo="actions">
				<Button label="Submit" onClick={() => undefined} type="submit" />
				<Button label="Reset" onClick={() => undefined} type="reset" />
			</div>
		</form>
		<p role="status">{submitted}</p>
		<div data-demo="grid">
			<label>Disabled<TextInput disabled value="Unavailable" icon={{ name: 'search' }} /></label>
			<label>Read only<TextInput readonly value="Fixed value" /></label>
			<label>Required and empty<TextInput required aria-describedby="required-help" /></label>
			<label>
				Server error<TextInput
					aria-invalid="true"
					aria-describedby="error-help"
					value="Incorrect"
				/>
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
