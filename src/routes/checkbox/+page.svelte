<script lang="ts">
	import { Checkbox } from '$lib/index.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	let checked = $state(false);
	let submitted = $state('No submission yet.');
	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const props = [
		{
			name: 'size',
			type: 'Size',
			required: false,
			default: 'medium',
			description: 'Checkbox size from x-small through x-large.'
		},
		{
			name: 'checked',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bind to the checked state.'
		}
	];
</script>

<Page title={chapter} description="A glass checkbox for selecting a form value.">
	<Section {...sections[0]}>
		<label><Checkbox name="updates" value="yes" bind:checked /> Receive updates</label>
		<p role="status">{checked ? 'Selected' : 'Not selected'}</p>
		<CodeSnippet
			label="Checkbox usage code"
			source="&lt;label&gt;&lt;Checkbox name=&quot;updates&quot; value=&quot;yes&quot; bind:checked /&gt; Receive updates&lt;/label&gt;"
		/>
	</Section>
	<Section {...sections[1]}>
		<div data-demo="examples">
			{#each sizes as size (size)}
				<label><Checkbox {size} /> {size}</label>
				<label><Checkbox {size} checked /> Checked {size}</label>
			{/each}
			<label><Checkbox disabled /> Disabled</label>
			<label><Checkbox checked disabled /> Disabled checked</label>
			<label><Checkbox required /> Required</label>
		</div>
	</Section>
	<Section {...sections[2]}>
		<PropTable {props} />
		<p>
			Native input attributes, events, labels, validation, form values and keyboard activation are
			forwarded. Use <code>bind:checked</code>
			when needed. A checked box submits its value; an unchecked box submits nothing.
		</p>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				submitted = `Submitted: ${new FormData(event.currentTarget).get('consent') ?? 'none'}`;
			}}
			onreset={() => (submitted = 'Form reset.')}
		>
			<label><Checkbox name="consent" value="yes" required /> Consent required</label>
			<div data-demo="examples">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</div>
		</form>
		<p role="status">{submitted}</p>
	</Section>
</Page>

<style>
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-block-size: 2.75rem;
	}
	[data-demo='examples'] {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
	}
	form {
		display: grid;
		gap: 1rem;
	}
</style>
