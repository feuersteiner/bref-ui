<script lang="ts">
	/* eslint-disable max-lines -- Keep the native form examples and component matrix together on the documentation page. */
	import { TextArea, Select, Checkbox, TextInput, Switch, Button } from '$lib/index.js';
	import type { BaseSize, Variant } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import MovingBackground from '../components/moving-background.svelte';
	import { chapter, sections } from './sections.js';

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	const variants = ['neutral', 'soft'] as const;
	const glassUsage = '<TextArea glass placeholder="Write a message" rows={3} />';
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
		},
		{
			name: 'resizable',
			type: 'boolean',
			required: false,
			default: 'true',
			description: 'Allows vertical resizing.'
		}
	];
</script>

<Page title={chapter} description="A native multiline text control with an optional leading icon.">
	<Section {...sections[0]}>
		<div data-demo="fields">
			<label for="usage-text-area">Message</label>
			<TextArea id="usage-text-area" name="entry" placeholder="Write a message" rows={3} />
		</div>
		<CodeSnippet
			label="TextArea usage"
			source={`<script>\n  import { TextArea } from 'bref-ui';\n<${'/'}script>\n\n<label for="entry">Message</label>\n<TextArea id="entry" name="entry" rows={3} />`}
		/>
	</Section>

	<Section {...sections[1]}>
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
	<Section {...sections[2]}>
		<div data-demo="controls">
			<div data-control>
				<label for="text-area-size">Size</label>
				<Select
					id="text-area-size"
					items={sizes.map((id) => ({ id, label: id }))}
					bind:value={() => size, (next) => (size = next as typeof size)}
				/>
			</div>
			<div data-control>
				<label for="text-area-variant">Variant</label>
				<Select
					id="text-area-variant"
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
			<label data-toggle>
				<Checkbox bind:checked={resizable} />
				Resizable
			</label>
			<label>
				Rows
				<TextInput
					type="number"
					min={1}
					max={10}
					bind:value={
						() => (rows == null ? '' : String(rows)),
						(next) => (rows = next === '' ? undefined : Number(next))
					}
				/>
			</label>
		</div>
		<label data-toggle data-background-toggle>
			<Switch bind:checked={movingBackground} />
			Moving background
		</label>
		<div data-demo="playground">
			{#if movingBackground}<MovingBackground />{/if}
			<div data-demo="fields">
				<label for="playground-text-area">Editable message with icon</label>
				<TextArea
					id="playground-text-area"
					{size}
					{variant}
					{glass}
					{wide}
					icon={withIcon ? { name: 'edit' } : undefined}
					bind:value
					onChange={(next) => (lastChange = `TextArea: ${next}`)}
					oninput={() => nativeEvents++}
					{resizable}
					{rows}
				/>
				<p role="status">{lastChange}</p>
				<p>Bound value: {value}; native input events: {nativeEvents}</p>
			</div>
		</div>
		<CodeSnippet label="Glass TextArea usage" source={glassUsage} />
	</Section>
	<Section {...sections[3]}>
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
	<Section {...sections[4]}><PropTable {props} /></Section>
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
