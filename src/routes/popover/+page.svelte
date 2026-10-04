<script lang="ts">
	/* eslint-disable max-lines -- Keep the trigger composition examples and their documentation together. */
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Popover, TextInput } from '$lib/index.js';

	let inputOpen = $state(false);
	let open = $state(false);
	let longOpen = $state(false);
	let anotherOpen = $state(false);
	let initiallyOpen = $state(true);
	let formOpen = $state(false);
	const source = `<script>\n  import { Popover, TextInput } from 'bref-ui';\n  let open = $state(false);\n<${'/'}script>\n\n<Popover bind:open>\n  {#snippet trigger()}\n    <TextInput value="Sample text" aria-label="Search" aria-expanded={open}\n      oninput={() => open = true} onclick={() => open = true} />\n  {/snippet}\n  <p>Helpful details beside the input.</p>\n</Popover>`;
	const boundSource = `<script>\n  import { Popover } from 'bref-ui';\n  let open = $state(false);\n<${'/'}script>\n\n<Popover bind:open>\n  {#snippet trigger()}\n    <button type="button" aria-expanded={open} onclick={() => open = !open}>\n      Edit settings\n    </button>\n  {/snippet}\n  <button type="button" onclick={() => open = false}>Done</button>\n</Popover>`;
	const props = [
		{
			name: 'trigger',
			type: 'Snippet',
			required: true,
			default: '—',
			description: 'The owning control or component; manages its own events and accessibility.'
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
			description: 'Bindable visibility; native dismissals update it.'
		}
	];
</script>

<Page
	title={chapter}
	description="An anchored native popover whose trigger snippet renders the owning control or component."
>
	<Section {...sections[0]}>
		<div data-demo>
			<Popover bind:open={inputOpen}>
				{#snippet trigger()}
					<TextInput
						value="Sample text"
						aria-label="Search"
						aria-expanded={inputOpen}
						oninput={() => (inputOpen = true)}
						onclick={() => (inputOpen = true)}
					/>
				{/snippet}
				<p>Helpful details beside the input.</p>
				<a href="#keyboard">Keyboard guidance</a>
			</Popover>
		</div>
		<p>
			The trigger snippet renders TextInput directly. Its input and click handlers open the panel;
			click outside or press Escape to dismiss. The Surface panel matches the trigger width.
		</p>
		<CodeSnippet {source} label="Popover usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-controls>
			<Popover bind:open>
				{#snippet trigger()}
					<button type="button" aria-expanded={open} onclick={() => (open = !open)}>
						Edit settings
					</button>
				{/snippet}
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
			<Popover bind:open={longOpen}>
				{#snippet trigger()}
					<button type="button" aria-expanded={longOpen} onclick={() => (longOpen = !longOpen)}>
						Long content
					</button>
				{/snippet}
				<h3>Scrollable details</h3>
				{#each Array.from({ length: 18 }, (_, index) => index + 1) as item (item)}
					<p>Detail {item}: content stays within the viewport and scrolls inside the popover.</p>
				{/each}
				<button type="button">Last focusable item</button>
			</Popover>
			<Popover bind:open={anotherOpen}>
				{#snippet trigger()}
					<button
						type="button"
						aria-expanded={anotherOpen}
						onclick={() => (anotherOpen = !anotherOpen)}
					>
						Another instance
					</button>
				{/snippet}
				<p>Opening this dismisses the other independent popover.</p>
			</Popover>
			<Popover bind:open={initiallyOpen}>
				{#snippet trigger()}
					<button
						type="button"
						aria-expanded={initiallyOpen}
						onclick={() => (initiallyOpen = !initiallyOpen)}
					>
						Initially open
					</button>
				{/snippet}
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
			Both snippets receive no arguments. The trigger owns its native attributes, events, accessible
			name and expanded state. Its handlers control <code>bind:open</code>
			; Popover handles native dismissal and positioning.
		</p>
	</Section>
	<Section {...sections[4]}>
		<p>
			The trigger controls its keyboard behavior: buttons toggle with Enter or Space; the TextInput
			example opens on click or typing. Tab moves through the Surface and interactive content
			without trapping focus. Escape dismisses; closing from within the content returns focus to the
			owning control.
		</p>
		<form onsubmit={(event) => event.preventDefault()}>
			<Popover bind:open={formOpen}>
				{#snippet trigger()}
					<button type="button" aria-expanded={formOpen} onclick={() => (formOpen = !formOpen)}>
						Inside a form
					</button>
				{/snippet}
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
	div[data-demo] {
		box-sizing: border-box;
		min-height: 18rem;
		padding: 1.5rem;
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--color-primary) 24%, var(--color-background));
	}
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
