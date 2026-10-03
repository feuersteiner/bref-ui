<script lang="ts">
	/* eslint-disable max-lines -- Keep the native form examples and component matrix together on the documentation page. */
	import { Input, Textarea } from '$lib/index.js';
	import type { BaseSize } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	const variants = ['neutral', 'soft'] as const;
	const textTypes = ['text', 'email', 'password', 'search', 'tel', 'url'] as const;
	let text = $state('Hello');
	let number = $state<number | undefined>(12);
	let message = $state('A longer message can be resized vertically.');
	let size = $state<BaseSize>('medium');
	let variant = $state<'neutral' | 'soft'>('neutral');
	let resizable = $state(true);
	let submitted = $state('Submit the form to inspect its values.');
	let inputRef = $state<HTMLInputElement>();

	const inputProps = [
		{
			name: 'type',
			type: 'text | email | password | search | tel | url | number',
			required: false,
			default: 'text',
			description: 'Native input type.'
		},
		{
			name: 'value',
			type: 'string; number | undefined for number',
			required: false,
			default: 'Omitted',
			description: 'Bindable native value.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Visual size: small, medium or large.'
		},
		{
			name: 'variant',
			type: 'neutral | soft',
			required: false,
			default: 'neutral',
			description: 'Surface treatment.'
		},
		{
			name: 'htmlSize',
			type: 'number',
			required: false,
			default: 'Omitted',
			description: 'Native input size attribute.'
		},
		{
			name: 'ref',
			type: 'HTMLInputElement',
			required: false,
			default: 'Omitted',
			description: 'Bindable element reference.'
		}
	];
	const textareaProps = [
		{
			name: 'value',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Bindable native value.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Visual size: small, medium or large.'
		},
		{
			name: 'variant',
			type: 'neutral | soft',
			required: false,
			default: 'neutral',
			description: 'Surface treatment.'
		},
		{
			name: 'resizable',
			type: 'boolean',
			required: false,
			default: 'true',
			description: 'Allows vertical resizing.'
		},
		{
			name: 'ref',
			type: 'HTMLTextAreaElement',
			required: false,
			default: 'Omitted',
			description: 'Bindable element reference.'
		}
	];
</script>

<Page
	title={chapter}
	description="Native text, number and multiline controls with three sizes and two surface variants."
>
	<Section {...sections[0]}>
		<div data-demo="fields">
			<label for="usage-name">Name</label>
			<Input id="usage-name" name="name" placeholder="Your name" />
			<label for="usage-message">Message</label>
			<Textarea id="usage-message" name="message" rows={3} placeholder="Write a message" />
		</div>
		<CodeSnippet
			label="Input and Textarea usage"
			source={`<script>
  import { Input, Textarea } from 'bref-ui';
<${'/'}script>

<label for="name">Name</label>
<Input id="name" name="name" required />
<label for="message">Message</label>
<Textarea id="message" name="message" rows={3} />`}
		/>
	</Section>
	<Section {...sections[1]}>
		<div data-demo="grid">
			{#each textTypes as type (type)}
				<label>
					{type}<Input {type} placeholder={type === 'email' ? 'name@example.com' : type} />
				</label>
			{/each}
			<label>number<Input type="number" min={0} max={100} step={1} bind:value={number} /></label>
		</div>
		<p>Number binding: {number === undefined ? 'empty' : number}</p>
	</Section>
	<Section {...sections[2]}>
		<div data-demo="grid">
			{#each variants as currentVariant (currentVariant)}
				{#each sizes as currentSize (currentSize)}
					<label>
						{currentVariant}, {currentSize}<Input
							size={currentSize}
							variant={currentVariant}
							placeholder="Text input"
						/>
					</label>
					<label>
						{currentVariant}, {currentSize}<Textarea
							size={currentSize}
							variant={currentVariant}
							rows={2}
							placeholder="Textarea"
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
				Resizable textarea
			</label>
		</div>
		<div data-demo="fields">
			<label for="playground-input">Editable input</label>
			<Input id="playground-input" {size} {variant} bind:value={text} bind:ref={inputRef} />
			<label for="playground-textarea">Editable textarea</label>
			<Textarea
				id="playground-textarea"
				{size}
				{variant}
				{resizable}
				rows={3}
				bind:value={message}
			/>
			<button type="button" onclick={() => inputRef?.focus()}>Focus input through ref</button>
			<p>Input: {text}; textarea: {message}</p>
		</div>
	</Section>
	<Section {...sections[3]}>
		<p>
			Native labels, IDs, names, constraints, events, form association and ARIA attributes pass
			through. Bind values and refs with <code>bind:value</code>
			and
			<code>bind:ref</code>
			. No content snippet is used by these void and text controls.
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
			<Textarea id="form-note" name="note" value="Initial note" rows={2} />
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
			<label>Disabled textarea<Textarea disabled value="Unavailable" /></label>
			<label>Read only textarea<Textarea readonly value="Fixed note" /></label>
			<label>
				Invalid textarea<Textarea
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
		<h3>Input</h3>
		<PropTable props={inputProps} />
		<h3>Textarea</h3>
		<PropTable props={textareaProps} />
	</Section>
</Page>

<style>
	[data-demo='fields'],
	form {
		display: grid;
		gap: 12px;
		max-width: 32rem;
	}
	[data-demo='grid'] {
		display: grid;
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
