<script lang="ts">
	/* eslint-disable max-lines -- Keep the native form examples and component matrix together on the documentation page. */
	import { TextInput, Select, Checkbox, Switch, Button } from '$lib/index.js';
	import type { BaseSize, Variant } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import MovingBackground from '../components/moving-background.svelte';
	import { chapter, sections } from './sections.js';

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	const variants = ['neutral', 'soft'] as const;
	const glassUsage = '<TextInput glass placeholder="Your name" />';
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
	const props = [
		{
			name: 'value',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Bindable string value.'
		},
		{
			name: 'onChange',
			type: '(value: string) => void',
			required: false,
			default: 'Omitted',
			description: 'Called once per input edit.'
		},
		{
			name: 'icon',
			type: 'IconProps',
			required: false,
			default: 'Omitted',
			description: 'Decorative leading icon.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Small, medium or large.'
		},
		{
			name: 'variant',
			type: "Exclude<Variant, 'filled'>",
			required: false,
			default: 'soft',
			description: 'Neutral or soft surface treatment.'
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Translucent surface with backdrop blur.'
		},
		{
			name: 'wide',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Fills available width.'
		}
	];
</script>

<Page
	title={chapter}
	description="A native single-line text control with an optional leading icon."
>
	<Section {...sections[0]}>
		<div data-demo="fields">
			<label for="usage-text-input">Name</label>
			<TextInput id="usage-text-input" name="entry" placeholder="Your name" />
		</div>
		<CodeSnippet
			label="TextInput usage"
			source={`<script>\n  import { TextInput } from 'bref-ui';\n<${'/'}script>\n\n<label for="entry">Name</label>\n<TextInput id="entry" name="entry"  />`}
		/>
	</Section>
	<Section {...sections[1]}>
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
	<Section {...sections[2]}>
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
	<Section {...sections[3]}>
		<div data-demo="controls">
			<div data-control>
				<label for="text-input-size">Size</label>
				<Select
					id="text-input-size"
					items={sizes.map((id) => ({ id, label: id }))}
					bind:value={() => size, (next) => (size = next as typeof size)}
				/>
			</div>
			<div data-control>
				<label for="text-input-variant">Variant</label>
				<Select
					id="text-input-variant"
					items={variants.map((id) => ({ id, label: id }))}
					bind:value={() => variant, (next) => (variant = next as typeof variant)}
				/>
			</div>
			<label data-toggle>
				<Checkbox bind:checked={withIcon} />
				Icon
			</label>
			<label data-toggle>
				<Checkbox bind:checked={glass} />
				Glass
			</label>
			<label data-toggle>
				<Checkbox bind:checked={wide} />
				Wide
			</label>
		</div>
		<label data-toggle data-background-toggle>
			<Switch bind:checked={movingBackground} />
			Moving background
		</label>
		<div data-demo="playground">
			{#if movingBackground}<MovingBackground />{/if}
			<div data-demo="fields">
				<label for="playground-text-input">Editable input with icon</label>
				<TextInput
					id="playground-text-input"
					{size}
					{variant}
					{glass}
					{wide}
					icon={withIcon ? { name: 'search' } : undefined}
					bind:value
					onChange={(next) => (lastChange = `TextInput: ${next}`)}
					oninput={() => nativeEvents++}
				/>
				<p role="status">{lastChange}</p>
				<p>Bound value: {value}; native input events: {nativeEvents}</p>
			</div>
		</div>
		<CodeSnippet label="Glass TextInput usage" source={glassUsage} />
	</Section>
	<Section {...sections[4]}>
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
	<Section {...sections[5]}><PropTable {props} /></Section>
</Page>

<style>
	[data-demo='playground'] {
		position: relative;
		isolation: isolate;
		padding: 1rem;
	}
	[data-demo='playground'] > [data-demo='fields'] {
		position: relative;
		z-index: 1;
	}
	[data-background-toggle] {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-block: 1rem;
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
	[data-demo='grid'] label,
	[data-demo='controls'] label {
		display: grid;
		gap: 8px;
	}
	[data-demo='controls'],
	[data-demo='actions'] {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		margin-block: 24px;
	}
	[data-demo='controls'] label[data-toggle] {
		display: flex;
		align-items: center;
	}
	[data-control] {
		display: grid;
		gap: 0.5rem;
		width: min(100%, 12rem);
		min-width: 0;
	}
</style>
