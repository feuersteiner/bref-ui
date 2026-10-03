<script lang="ts">
	import { Dialog } from '$lib/index.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	let open = $state(false);
	let lockedOpen = $state(false);
	let dismissible = $state(true);
	let closeOnBackdropClick = $state(true);
	let lastEvent = $state('No close event yet');

	const source = `<script lang="ts">
  import { Dialog } from 'bref-ui';
  let open = $state(false);
<${'/'}script>

<button onclick={() => open = true}>Open dialog</button>
<Dialog bind:open title="Edit details" description="Changes are local until saved.">
  <p>Compose content and actions here.</p>
  <button onclick={() => open = false}>Done</button>
</Dialog>`;

	const props = [
		{
			name: 'title',
			type: 'string',
			required: true,
			default: '—',
			description: 'Visible accessible title.'
		},
		{
			name: 'open',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bindable modal state.'
		},
		{
			name: 'description',
			type: 'string',
			required: false,
			default: 'Omitted',
			description: 'Visible accessible description.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: false,
			default: 'Omitted',
			description: 'Content and application-owned actions.'
		},
		{
			name: 'dismissible',
			type: 'boolean',
			required: false,
			default: 'true',
			description: 'Allow Escape and the close button.'
		},
		{
			name: 'closeOnBackdropClick',
			type: 'boolean',
			required: false,
			default: 'true',
			description: 'Allow pointer dismissal from the backdrop.'
		}
	];
</script>

<Page
	title={chapter}
	description="Present modal content with native keyboard focus, dismissal, and accessible naming."
>
	<Section {...sections[0]}>
		<p>
			Open a modal and compose its content with native elements. The dialog owns no business action.
		</p>
		<button type="button" onclick={() => (open = true)}>Open dialog</button>
		<Dialog
			bind:open
			title="Edit details"
			description="Changes are local until saved."
			onclose={() => (lastEvent = 'Closed')}
		>
			<label>
				Display name <input value="Example name" />
			</label>
			<div data-actions>
				<button type="button" onclick={() => (open = false)}>Done</button>
			</div>
		</Dialog>
		<p aria-live="polite">{lastEvent}</p>
		<CodeSnippet {source} label="Dialog usage code" />
	</Section>
	<Section {...sections[1]}>
		<p>
			Tab stays inside the open modal. Escape, the close button, backdrop clicks, and native dialog
			forms update <code>bind:open</code>
			. Closing returns focus to the opener.
		</p>
		<label>
			<input type="checkbox" bind:checked={dismissible} />
			Allow Escape and close button
		</label>
		<label>
			<input type="checkbox" bind:checked={closeOnBackdropClick} />
			Allow backdrop dismissal
		</label>
		<button type="button" onclick={() => (lockedOpen = true)}>Open dismissal demo</button>
		<Dialog
			bind:open={lockedOpen}
			title="Dismissal demo"
			description="Try Tab, Shift+Tab, Escape, and the backdrop."
			{dismissible}
			{closeOnBackdropClick}
		>
			<p>
				The form below uses native <code>method="dialog"</code>
				closing.
			</p>
			<form method="dialog"><button type="submit">Close with form</button></form>
		</Dialog>
	</Section>
	<Section {...sections[2]}>
		<PropTable {props} />
		<p>
			Native dialog attributes and events are forwarded. The title and description set <code>
				aria-labelledby
			</code>
			and
			<code>aria-describedby</code>
			. The browser manages modal focus and focus return.
		</p>
	</Section>
</Page>

<style>
	label {
		display: block;
		margin-block: 0.75rem;
	}
	input:not([type='checkbox']) {
		display: block;
		width: 100%;
		max-width: 24rem;
		margin-top: 0.5rem;
	}
	button {
		min-height: 2.5rem;
		padding: 0.5rem 1rem;
	}
	button:focus-visible,
	input:focus-visible {
		outline: 2px solid var(--color-foreground);
		outline-offset: 2px;
	}
	[data-actions] {
		display: flex;
		justify-content: flex-end;
		margin-top: 1.5rem;
	}
</style>
