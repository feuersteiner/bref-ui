<script lang="ts">
	/* eslint-disable max-lines -- Keep the trigger composition examples and their documentation together. */
	import { resolve } from '$app/paths';
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Popover, TextInput, Checkbox, Button } from '$lib/index.js';

	let inputOpen = $state(false);
	let inputWide = $state(false);
	let open = $state(false);
	let longOpen = $state(false);
	let anotherOpen = $state(false);
	let initiallyOpen = $state(true);
	let formOpen = $state(false);
	let shortOpen = $state(false);
	let fillOpen = $state(false);
	let fitOpen = $state(false);
	const source = `<script>
  import { Checkbox, Popover, TextInput } from 'bref-ui';
  let open = $state(false);
  let wide = $state(false);
<${'/'}script>

<label><Checkbox bind:checked={wide} /> Wide input</label>
<Popover bind:open scroll>
  {#snippet trigger()}
    <TextInput {wide} value="Sample text" aria-label="Search" aria-expanded={open}
      oninput={() => open = true} onclick={() => open = true} />
  {/snippet}
  <p>Helpful details beside the input.</p>
</Popover>`;
	const boundSource = `<script>
  import { Button, Popover, TextInput } from 'bref-ui';
  let open = $state(false);
<${'/'}script>

<Popover bind:open variant="filled" spacing="medium" radius="small" shadow scroll>
  {#snippet trigger()}
    <Button label="Edit settings" onClick={() => open = !open}
      aria-expanded={open} />
  {/snippet}
  <label>Display name <TextInput value="Example" /></label>
  <Button label="Done" onClick={() => open = false} />
</Popover>`;
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
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Keep the panel closed; the trigger controls its own disabled state.'
		},
		{
			name: 'Surface styling props',
			type: 'Selected SurfaceProps',
			required: false,
			default: 'soft glass, medium spacing, small radius, medium shadow',
			description:
				'Forwarded to the glass panel. Variant defaults to soft; explicit variants, colors and classes customize it. Width fill matches the trigger; omitted or fit grows with content.'
		}
	];
</script>

<Page
	title={chapter}
	description="An anchored native popover whose trigger snippet renders the owning control or component."
>
	<Section {...sections[0]}>
		<label data-wide-control>
			<Checkbox bind:checked={inputWide} />
			<span>Wide input</span>
		</label>
		<div data-demo>
			<Popover bind:open={inputOpen} scroll>
				{#snippet trigger()}
					<TextInput
						wide={inputWide}
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
			click outside or press Escape to dismiss. The default soft glass panel fits its content and is
			at least as wide as the trigger, within the viewport. Toggle wide to check the anchor minimum.
		</p>
		<CodeSnippet {source} label="Popover usage code" />
	</Section>
	<Section {...sections[1]}>
		<div data-controls>
			<Popover bind:open variant="filled" spacing="medium" radius="small" shadow scroll>
				{#snippet trigger()}
					<Button label="Edit settings" onClick={() => (open = !open)} aria-expanded={open} />
				{/snippet}
				<label>
					Display name <TextInput value="Example" />
				</label>
				<Button label="Done" onClick={() => (open = false)} />
			</Popover>
			<Button label="Open programmatically" onClick={() => (open = true)} />
			<Button label="Close programmatically" onClick={() => (open = false)} />
		</div>
		<p role="status">Settings {open ? 'open' : 'closed'}.</p>
		<CodeSnippet source={boundSource} label="Bound Popover usage code" />
	</Section>
	<Section {...sections[2]}>
		<div data-controls>
			<Popover bind:open={longOpen} scroll>
				{#snippet trigger()}
					<Button
						label="Long content"
						onClick={() => (longOpen = !longOpen)}
						aria-expanded={longOpen}
					/>
				{/snippet}
				<h3>Scrollable details</h3>
				{#each Array.from({ length: 18 }, (_, index) => index + 1) as item (item)}
					<p>Detail {item}: content stays within the viewport and scrolls inside the popover.</p>
				{/each}
				<Button label="Last focusable item" onClick={() => undefined} />
			</Popover>
			<Popover
				bind:open={anotherOpen}
				variant="soft"
				color="primary"
				spacing="medium"
				radius="small"
				shadow
				scroll
			>
				{#snippet trigger()}
					<Button
						label="Another instance"
						onClick={() => (anotherOpen = !anotherOpen)}
						aria-expanded={anotherOpen}
					/>
				{/snippet}
				<p>Opening this dismisses the other independent popover.</p>
			</Popover>
			<Popover
				bind:open={initiallyOpen}
				variant="filled"
				spacing="medium"
				radius="small"
				shadow
				scroll
			>
				{#snippet trigger()}
					<Button
						label="Initially open"
						onClick={() => (initiallyOpen = !initiallyOpen)}
						aria-expanded={initiallyOpen}
					/>
				{/snippet}
				<p>This bound example starts open when the page loads.</p>
				<Button label="Dismiss initial example" onClick={() => (initiallyOpen = false)} />
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
			Popover accepts <a href={resolve('/surface#props')}>Surface props</a>
			for styling and layout, including class and style, without inheriting generic HTML attributes. Every
			panel uses glass, with soft as the default variant. Explicit spacing, radius, shadow, variant, color
			and class choices customize that material. Another instance uses a soft primary color.
		</p>
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
			<Popover bind:open={formOpen} variant="filled" spacing="medium" radius="small" shadow scroll>
				{#snippet trigger()}
					<Button
						label="Inside a form"
						onClick={() => (formOpen = !formOpen)}
						aria-expanded={formOpen}
					/>
				{/snippet}
				<p>The trigger is a button and does not submit the form.</p>
				<label>
					Example field <TextInput name="example" />
				</label>
			</Popover>
			<Button label="Submit form" onClick={() => undefined} type="submit" />
		</form>
	</Section>

	<Section {...sections[5]}>
		<div data-controls>
			<Popover bind:open={shortOpen}>
				{#snippet trigger()}
					<Button
						label="Short content"
						onClick={() => (shortOpen = !shortOpen)}
						aria-expanded={shortOpen}
					/>
				{/snippet}
				<p>Saved.</p>
			</Popover>
			<Popover bind:open={fillOpen} width="fill" variant="filled" scroll>
				{#snippet trigger()}
					<Button
						label="Anchor width"
						onClick={() => (fillOpen = !fillOpen)}
						aria-expanded={fillOpen}
					/>
				{/snippet}
				<p>This explicit fill width follows the trigger, wrapping these details naturally.</p>
			</Popover>
			<Popover bind:open={fitOpen} width="fit" scroll>
				{#snippet trigger()}
					<Button
						label="Content width"
						onClick={() => (fitOpen = !fitOpen)}
						aria-expanded={fitOpen}
					/>
				{/snippet}
				<p>
					Longer prose fits its content until the viewport provides a comfortable wrapping boundary.
				</p>
				<p>
					Unbroken tokens wrap only when needed: <code>
						workspace_0123456789abcdefghijklmnopqrstuvwxyz_0123456789abcdefghijklmnopqrstuvwxyz_0123456789abcdefghijklmnopqrstuvwxyz
					</code>
				</p>
			</Popover>
			<Popover disabled>
				{#snippet trigger()}
					<Button label="Disabled popover" disabled />
				{/snippet}
				<p>This panel stays closed.</p>
			</Popover>
		</div>
		<p>
			Short content keeps the anchor minimum. Explicit fill follows the anchor; fit follows content.
			Both stay within the viewport and use glass automatically.
		</p>
	</Section>
</Page>

<style>
	label[data-wide-control] {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
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
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
</style>
