<script lang="ts">
	import { Popover } from '$lib/index.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	let disabled = $state(false);
	let actions = $state(0);
	const source = `<Popover>
  {#snippet trigger()}Options{/snippet}
  <button type="button">An action</button>
</Popover>`;
	const props = [
		{
			name: 'trigger',
			type: 'Snippet',
			required: true,
			default: '—',
			description: 'Content of the native trigger button.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: true,
			default: '—',
			description: 'Content of the popover panel.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disables the trigger button.'
		},
		{
			name: 'id',
			type: 'string',
			required: false,
			default: 'Generated',
			description: 'Panel ID used by the trigger.'
		}
	];
</script>

<Page title={chapter} description="A reusable panel opened by a native button trigger.">
	<Section {...sections[0]}>
		<div data-demo="row">
			<Popover>
				{#snippet trigger()}Options{/snippet}
				<p>Popover content can contain ordinary text and controls.</p>
				<button type="button" onclick={() => actions++}>An action</button>
			</Popover>
			<label>
				<input type="checkbox" bind:checked={disabled} />
				Disable the next trigger
			</label>
			<Popover {disabled} title="Disabled example">
				{#snippet trigger()}More options{/snippet}
				<p>Toggle the checkbox to try this panel.</p>
			</Popover>
		</div>
		<p role="status">Actions: {actions}</p>
		<CodeSnippet {source} label="Popover usage code" />
	</Section>
	<Section {...sections[1]}>
		<p>
			Tab to the trigger; Enter or Space opens the panel. Escape closes it. Clicking outside also
			closes it. Focus follows the browser’s native popover behavior; interactive content remains in
			the normal tab order. Add dialog, menu, or listbox semantics only when the containing feature
			implements their full keyboard rules.
		</p>
	</Section>
	<Section {...sections[2]}>
		<PropTable {props} />
		<p>
			Native div attributes, including ARIA attributes and event handlers, pass to the panel. The
			trigger and panel use snippets. No bindable open state is exposed.
		</p>
	</Section>
</Page>

<style>
	[data-demo='row'] {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
