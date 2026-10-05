<script lang="ts">
	/* eslint-disable max-lines -- Keep the dialog's interactive gallery examples together. */
	import { Button, Checkbox, Dialog, TextInput } from '$lib/index.js';
	import type { DialogProps, StatusColor } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large', 'full-screen'] as const;
	const colors: StatusColor[] = ['info', 'success', 'warning', 'error'];
	let open = $state(false);
	let dismissalOpen = $state(false);
	let actionOpen = $state(false);
	let snippetOpen = $state(false);
	let dismissible = $state(true);
	let selectedSize = $state<NonNullable<DialogProps['size']>>('medium');
	let selectedColor = $state<StatusColor>('info');
	let lastEvent = $state('No action yet');

	const source = `<script lang="ts">
  import { Button, Dialog, TextInput } from 'bref-ui';
  let open = $state(false);
<${'/'}script>

<Button label="Open dialog" onClick={() => open = true} />
<Dialog bind:open header={{ title: 'Edit details', description: 'Changes are local until saved.' }}>
  <label>
    Display name <TextInput value="Example name" />
  </label>
</Dialog>`;

	const props = [
		{
			name: 'header',
			type: 'DialogHeaderDataProps',
			required: true,
			default: '—',
			description: 'Title, optional description, and optional decorative icon.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: true,
			default: '—',
			description: 'Dialog body.'
		},
		{
			name: 'open',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bindable modal state.'
		},
		{
			name: 'footer',
			type: 'Snippet | { primary: DialogActionProps; secondary: DialogActionProps }',
			required: false,
			default: 'Omitted',
			description:
				'Custom footer or exactly two actions; each action accepts label, icon, onClick, disabled, and status color.'
		},
		{
			name: 'dismissible',
			type: 'boolean',
			required: false,
			default: 'true',
			description: 'Allow Escape and show the close button.'
		},
		{
			name: 'size',
			type: "Size | 'full-screen'",
			required: false,
			default: 'medium',
			description: 'Dialog width or full-screen; screens up to 36rem always use full-screen.'
		}
	];
</script>

{#snippet customFooter()}
	<Button label="Done" onClick={() => (snippetOpen = false)} />
{/snippet}

<Page title={chapter} description="Present modal content with native focus and accessible naming.">
	<Section {...sections[0]}>
		<p>Open a modal with a named header and a body snippet.</p>
		<Button label="Open dialog" onClick={() => (open = true)} />
		<Dialog
			bind:open
			header={{
				title: 'Edit details',
				description: 'Changes are local until saved.',
				icon: { name: 'edit' }
			}}
			onclose={() => (lastEvent = 'Closed')}
		>
			<label>
				Display name <TextInput value="Example name" />
			</label>
			<p>Backdrop clicks leave the dialog open.</p>
		</Dialog>
		<p aria-live="polite">{lastEvent}</p>
		<CodeSnippet {source} label="Dialog usage code" />
	</Section>
	<Section {...sections[1]}>
		<p>
			Tab remains inside the modal. Escape and the close button follow the dismissible control.
			Close from the caller by setting the state bound to <code>open</code>
			to
			<code>false</code>
			. Focus returns to the opener after the exit animation.
		</p>
		<label data-checkbox-control>
			<Checkbox bind:checked={dismissible} />
			Allow Escape and close button
		</label>
		<Button label="Open dismissal demo" onClick={() => (dismissalOpen = true)} />
		<Dialog
			bind:open={dismissalOpen}
			header={{
				title: 'Dismissal demo',
				description: 'Try Tab, Escape, the backdrop and the bound state.'
			}}
			{dismissible}
		>
			<Button label="Close via binding" onClick={() => (dismissalOpen = false)} />
		</Dialog>
	</Section>
	<Section {...sections[2]}>
		<p>
			Choose a size and status color, then test the two action callbacks. Small screens always use
			full-screen.
		</p>
		<label>
			Size
			<select bind:value={selectedSize}>
				{#each sizes as size (size)}<option value={size}>{size}</option>{/each}
			</select>
		</label>
		<label>
			Action color
			<select bind:value={selectedColor}>
				{#each colors as color (color)}<option value={color}>{color}</option>{/each}
			</select>
		</label>
		<Button label="Open action dialog" onClick={() => (actionOpen = true)} />
		<Dialog
			bind:open={actionOpen}
			header={{ title: 'Confirm changes', icon: { name: 'info' } }}
			size={selectedSize}
			footer={{
				secondary: {
					label: 'Keep editing',
					onClick: () => (lastEvent = 'Secondary action')
				},
				primary: {
					label: 'Save changes',
					icon: { name: 'check' },
					color: selectedColor,
					onClick: () => (lastEvent = 'Primary action')
				}
			}}
		>
			<p>Actions run their callbacks and leave closing to the caller.</p>
		</Dialog>
		<Button label="Open custom footer" onClick={() => (snippetOpen = true)} />
		<Dialog bind:open={snippetOpen} header={{ title: 'Custom footer' }} footer={customFooter}>
			<p>The caller controls this footer snippet.</p>
		</Dialog>
	</Section>
	<Section {...sections[3]}>
		<PropTable {props} />
		<p>
			The header title and optional description supply accessible names. Native dialog attributes,
			close and cancel events are forwarded. The body and optional footer accept snippets.
		</p>
	</Section>
</Page>

<style>
	label {
		display: grid;
		gap: 0.5rem;
		margin-block: 0.75rem;
	}
	label[data-checkbox-control] {
		display: flex;
		align-items: center;
	}
	select {
		width: 100%;
		max-width: 24rem;
		min-height: 2.5rem;
	}
	select:focus-visible {
		outline: 2px solid var(--color-foreground);
		outline-offset: 2px;
	}
</style>
