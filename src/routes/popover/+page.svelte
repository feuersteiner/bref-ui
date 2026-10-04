<script lang="ts">
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Popover } from '$lib/index.js';

	let open = $state(false);
	let initiallyOpen = $state(true);
	const source = `<script>\n  import { Popover } from 'bref-ui';\n<${'/'}script>\n\n<Popover>\n  {#snippet trigger()}More information{/snippet}\n  <p>Helpful details beside the trigger.</p>\n</Popover>`;
	const boundSource = `<script>\n  import { Popover } from 'bref-ui';\n  let open = $state(false);\n<${'/'}script>\n\n<Popover bind:open>\n  {#snippet trigger()}Edit settings{/snippet}\n  <button onclick={() => open = false}>Done</button>\n</Popover>`;
	const props = [
		{
			name: 'trigger',
			type: 'Snippet',
			required: true,
			default: '—',
			description: 'Parameterless content for the owned native button.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: true,
			default: '—',
			description: 'Parameterless content inside the popover.'
		},
		{
			name: 'open',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bindable open state; managed internally when unbound.'
		}
	];
</script>

<Page
	title={chapter}
	description="An anchored native popover with an owned trigger button and optional bound state."
>
	<Section {...sections[0]}>
		<Popover>
			{#snippet trigger()}More information{/snippet}
			<p>Helpful details beside the trigger.</p>
			<a href="#keyboard">Keyboard guidance</a>
		</Popover>
		<p>
			The Surface panel matches the trigger width. Click the trigger to toggle; click outside or
			press Escape to dismiss.
		</p>
		<CodeSnippet {source} label="Popover usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-controls>
			<Popover bind:open>
				{#snippet trigger()}Edit settings{/snippet}
				<label>
					Display name <input value="Example" />
				</label>
				<button type="button" onclick={() => (open = false)}>Done</button>
			</Popover>
			<button type="button" onclick={() => (open = true)}>Open programmatically</button>
			<button type="button" onclick={() => (open = false)}>Close programmatically</button>
		</div>
		<p role="status">Settings {open ? 'open' : 'closed'}.</p>
		<CodeSnippet source={boundSource} label="Bound Popover usage code" />
	</Section>
	<Section {...sections[2]}>
		<div data-controls>
			<Popover>
				{#snippet trigger()}Long content{/snippet}
				<h3>Scrollable details</h3>
				{#each Array.from({ length: 18 }, (_, index) => index + 1) as item (item)}
					<p>Detail {item}: content stays within the viewport and scrolls inside the popover.</p>
				{/each}
				<button type="button">Last focusable item</button>
			</Popover>
			<Popover>
				{#snippet trigger()}Another instance{/snippet}
				<p>Opening this dismisses the other independent popover.</p>
			</Popover>
			<Popover bind:open={initiallyOpen}>
				{#snippet trigger()}Initially open{/snippet}
				<p>This bound example starts open when the page loads.</p>
				<button type="button" onclick={() => (initiallyOpen = false)}>
					Dismiss initial example
				</button>
			</Popover>
		</div>
		<p>
			Resize the viewport, scroll the page and switch the shared theme control to test fitting,
			anchoring and light/dark modes.
		</p>
	</Section>
	<Section {...sections[3]}>
		<PropTable {props} />
		<p>
			Both snippets receive no arguments. Keep trigger content noninteractive and give it an
			accessible name. Native attributes and events are internal; <code>open</code>
			is the supported binding.
		</p>
	</Section>
	<Section {...sections[4]}>
		<p>
			Tab to a trigger and use Enter or Space to toggle. Tab moves through the scrollable Surface
			and interactive content without trapping focus. Escape dismisses and returns focus to the
			trigger; closing from within the content also returns focus. Clicking another control keeps
			that control usable.
		</p>
		<form onsubmit={(event) => event.preventDefault()}>
			<Popover>
				{#snippet trigger()}Inside a form{/snippet}
				<p>The trigger is a button and does not submit the form.</p>
				<label>
					Example field <input name="example" />
				</label>
			</Popover>
			<button type="submit">Submit form</button>
		</form>
	</Section>
</Page>

<style>
	div[data-controls],
	form {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}
	p,
	label,
	h3 {
		margin-block-end: 0.75rem;
	}
	label {
		display: grid;
		gap: 0.5rem;
	}
	input {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
	}
	button,
	input {
		min-height: 2.75rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-muted);
		border-radius: 0.5rem;
		background: var(--color-background);
		color: var(--color-foreground);
		font: inherit;
	}
	button:focus-visible,
	input:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
</style>
