<script lang="ts">
	/* eslint-disable max-lines -- Keep the native form examples and component matrix together on the documentation page. */
	import { Input } from '$lib/index.js';
	import type { BaseSize } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';
	import MovingBackground from '../components/moving-background.svelte';

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	const variants = ['neutral', 'soft'] as const;
	const types = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'] as const;
	let text = $state('Hello');
	let message = $state('A longer message can be resized vertically.');
	let number = $state('12');
	let size = $state<BaseSize>('medium');
	let variant = $state<'neutral' | 'soft'>('neutral');
	let resizable = $state(true);
	let wide = $state(false);
	let movingBackground = $state(false);
	let lastChange = $state('Edit either field to inspect onChange.');
	let submitted = $state('Submit the form to inspect its values.');

	const props = [
		{
			name: 'value',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Bindable value.'
		},
		{
			name: 'onChange',
			type: '(value: string) => void',
			required: false,
			default: 'Omitted',
			description: 'Called once per input edit.'
		},
		{
			name: 'placeholder',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Native placeholder.'
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
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disables the native control.'
		},
		{
			name: 'multiline',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Renders a textarea when true.'
		},
		{
			name: 'resizable',
			type: 'boolean',
			required: false,
			default: 'true',
			description: 'Allows vertical textarea resizing.'
		},
		{
			name: 'rows',
			type: 'number',
			required: false,
			default: 'Native',
			description: 'Textarea rows.'
		},
		{
			name: 'wide',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Fills available width.'
		},
		{
			name: 'variant',
			type: 'neutral | soft',
			required: false,
			default: 'neutral',
			description: 'Surface treatment.'
		}
	];
</script>

<Page title={chapter} description="One native text control for single-line and multiline entry.">
	<Section {...sections[0]}>
		<div data-demo="fields">
			<label for="usage-name">Name</label>
			<Input id="usage-name" name="name" placeholder="Your name" />
			<label for="usage-message">Message</label>
			<Input multiline id="usage-message" name="message" rows={3} placeholder="Write a message" />
		</div>
		<CodeSnippet
			label="Input usage"
			source={`<script>\n  import { Input } from 'bref-ui';\n<${'/'}script>\n\n<label for="name">Name</label>\n<Input id="name" name="name" required />\n<label for="message">Message</label>\n<Input multiline id="message" name="message" rows={3} />`}
		/>
	</Section>
	<Section {...sections[1]}>
		<div data-demo="grid">
			{#each types as type (type)}
				<label>{type}<Input {type} placeholder={type} /></label>
			{/each}
			<label>
				String value from number input<Input
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
		<div data-demo="grid">
			{#each variants as currentVariant (currentVariant)}
				{#each sizes as currentSize (currentSize)}
					<label>
						{currentVariant}, {currentSize}<Input
							size={currentSize}
							variant={currentVariant}
							placeholder="Single line"
						/>
					</label>
					<label>
						{currentVariant}, {currentSize}, multiline<Input
							multiline
							size={currentSize}
							variant={currentVariant}
							rows={2}
							placeholder="Multiple lines"
						/>
					</label>
				{/each}
			{/each}
		</div>
		<div data-demo="controls">
			<label>
				Size
				<select bind:value={size}>
					{#each sizes as option (option)}<option>{option}</option>{/each}
				</select>
			</label>
			<label>
				Variant
				<select bind:value={variant}>
					{#each variants as option (option)}<option>{option}</option>{/each}
				</select>
			</label>
			<label>
				<input type="checkbox" bind:checked={resizable} />
				Resizable
			</label>
			<label>
				<input type="checkbox" bind:checked={wide} />
				Wide
			</label>
		</div>
		<label data-background-toggle>
			<input type="checkbox" role="switch" bind:checked={movingBackground} />
			Moving background
		</label>
		<div data-demo="playground">
			{#if movingBackground}<MovingBackground />{/if}
			<div data-demo="fields">
				<label for="playground-input">Editable input with icon</label>
				<Input
					id="playground-input"
					{size}
					{variant}
					{wide}
					icon={{ name: 'search' }}
					bind:value={text}
					onChange={(value) => (lastChange = `Input: ${value}`)}
				/>
				<label for="playground-textarea">Editable textarea with icon</label>
				<Input
					multiline
					id="playground-textarea"
					{size}
					{variant}
					{wide}
					{resizable}
					rows={3}
					icon={{ name: 'edit' }}
					bind:value={message}
					onChange={(value) => (lastChange = `Textarea: ${value}`)}
				/>
				<p role="status">{lastChange}</p>
				<p>Bound values: {text}; {message}</p>
			</div>
		</div>
	</Section>
	<Section {...sections[3]}>
		<p>
			Native labels, IDs, names, constraints, events, form association and ARIA attributes pass
			through. Use <code>bind:value</code>
			for either mode. No content snippet is used.
		</p>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				submitted = `Submitted: ${data.get('email')}, ${data.get('note')}`;
			}}
			onreset={() => (submitted = 'Form reset.')}
		>
			<label for="form-email">Email</label>
			<Input id="form-email" name="email" type="email" value="name@example.com" required />
			<label for="form-note">Note</label>
			<Input multiline id="form-note" name="note" value="Initial note" rows={2} />
			<div data-demo="actions">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</div>
		</form>
		<p role="status">{submitted}</p>
		<div data-demo="grid">
			<label>Disabled<Input disabled value="Unavailable" /></label>
			<label>Read only<Input readonly value="Fixed value" /></label>
			<label>Required and empty<Input required aria-describedby="required-help" /></label>
			<label>
				Server error<Input
					aria-invalid="true"
					aria-describedby="input-error-help"
					value="Incorrect"
				/>
			</label>
			<label>Disabled textarea<Input multiline disabled value="Unavailable" /></label>
			<label>Read only textarea<Input multiline readonly value="Fixed note" /></label>
			<label>
				Invalid textarea<Input
					multiline
					aria-invalid="true"
					aria-describedby="textarea-error-help"
					value="Incorrect note"
				/>
			</label>
		</div>
		<p id="required-help">Required fields use native validation on submission.</p>
		<p id="input-error-help">This entry was not accepted. Check the value and try again.</p>
		<p id="textarea-error-help">The note needs more detail before it can be saved.</p>
	</Section>
	<Section {...sections[4]}>
		<PropTable {props} />
	</Section>
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
	[data-demo='controls'] label:has(input[type='checkbox']) {
		display: flex;
		align-items: center;
	}
	button,
	select {
		min-height: 40px;
	}
</style>
