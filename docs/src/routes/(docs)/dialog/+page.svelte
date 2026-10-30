<script lang="ts">
	/* eslint-disable max-lines -- Keep the dialog's interactive gallery examples together. */
	import { Button, Checkbox, Dialog, TextInput, Select } from 'bref-ui';
	import type {
		DialogProps,
		StatusColor,
		DialogHeaderDataProps,
		DialogActionProps,
		IconName
	} from 'bref-ui/types';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
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
	let longOpen = $state(false);
	let headerMotionOpen = $state(false);
	let headerSaved = $state(false);
	let dismissible = $state(true);
	let selectedSize = $state<NonNullable<DialogProps['size']>>('medium');
	let selectedColor = $state<StatusColor>('info');
	let lastEvent = $state('No action yet');

	let previewOpen = $state(false);
	let previewDismissible = $state(true);
	let previewGlass = $state(true);
	let previewCloseOnBackdrop = $state(false);
	let previewSize = $state<NonNullable<DialogProps['size']>>('medium');
	let headerTitle = $state('Edit details');
	let headerDescription = $state('Changes are local until saved.');
	let headerIcon = $state(true);
	let headerIconName = $state<IconName>('edit');
	const iconNames = ['edit', 'info', 'check', 'warning', 'favorite'] as const;
	let headerIconFilled = $state(false);
	let bodyMode = $state('form');
	let footerMode = $state('actions');
	let primaryLabel = $state('Save changes');
	let secondaryLabel = $state('Keep editing');
	let primaryDisabled = $state(false);
	let secondaryDisabled = $state(false);
	let actionIcon = $state(true);
	let previewColor = $state<StatusColor>('info');
	let previewEvent = $state('No action yet');
	let previewCloseCount = $state(0);
	let previewCancelCount = $state(0);
	const bodyModes = ['form', 'short', 'long'] as const;
	const footerModes = ['actions', 'snippet', 'none'] as const;
	const reset = () => {
		previewOpen = false;
		previewDismissible = true;
		previewGlass = true;
		previewCloseOnBackdrop = false;
		previewSize = 'medium';
		headerTitle = 'Edit details';
		headerDescription = 'Changes are local until saved.';
		headerIcon = true;
		headerIconName = 'edit';
		headerIconFilled = false;
		bodyMode = 'form';
		footerMode = 'actions';
		primaryLabel = 'Save changes';
		secondaryLabel = 'Keep editing';
		primaryDisabled = false;
		secondaryDisabled = false;
		actionIcon = true;
		previewColor = 'info';
		previewEvent = 'No action yet';
		previewCloseCount = 0;
		previewCancelCount = 0;
	};
	const previewHeader = $derived<DialogHeaderDataProps>({
		title: headerTitle,
		description: headerDescription || undefined,
		icon: headerIcon ? { name: headerIconName, filled: headerIconFilled } : undefined
	});
	const previewActions = $derived<{ primary: DialogActionProps; secondary: DialogActionProps }>({
		primary: {
			label: primaryLabel,
			color: previewColor,
			icon: actionIcon ? { name: 'check' } : undefined,
			disabled: primaryDisabled,
			onClick: () => (previewEvent = 'Primary action')
		},
		secondary: {
			label: secondaryLabel,
			disabled: secondaryDisabled,
			onClick: () => (previewEvent = 'Secondary action')
		}
	});
	const playgroundSource = $derived(`<script>
  import { Button, Dialog, TextInput } from 'bref-ui';
  let open = $state(false);
  let lastEvent = $state('No action yet');
  let closeCount = $state(0);
  let cancelCount = $state(0);
<${'/'}script>
${footerMode === 'snippet' ? '\n{#snippet footer()}\n  <Button label="Done" onClick={() => open = false} />\n{/snippet}\n' : ''}
<Button label="Open preview dialog" onClick={() => open = true} />
<Dialog bind:open header={${JSON.stringify(previewHeader)}} size="${previewSize}" dismissible={${previewDismissible}} glass={${previewGlass}} closeOnBackdrop={${previewCloseOnBackdrop}}
  onclose={() => { lastEvent = 'Closed'; closeCount++; }} oncancel={() => { lastEvent = 'Cancel event'; cancelCount++; }}${
		footerMode === 'actions'
			? `
  footer={{
    primary: { label: ${JSON.stringify(primaryLabel)}, color: '${previewColor}', disabled: ${primaryDisabled}, ${actionIcon ? "icon: { name: 'check' }, " : ''}onClick: () => lastEvent = 'Primary action' },
    secondary: { label: ${JSON.stringify(secondaryLabel)}, disabled: ${secondaryDisabled}, onClick: () => lastEvent = 'Secondary action' }
  }}`
			: footerMode === 'snippet'
				? '\n  {footer}'
				: ''
	}>
${bodyMode === 'form' ? '  <label for="dialog-preview-name">Display name</label>\n  <TextInput id="dialog-preview-name" value="Example name" />' : bodyMode === 'long' ? '  {#each Array.from({ length: 12 }, (_, index) => index + 1) as note (note)}\n    <p>Note {note}. Review the complete details before saving changes.</p>\n  {/each}' : '  <p>Review the details before saving changes.</p>'}
  <Button label="Close via binding" onClick={() => open = false} />
</Dialog>
<p role="status">{lastEvent}; close events: {closeCount}; cancel events: {cancelCount}</p>`);
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
			description:
				'Title, optional description, and optional decorative icon. Title/icon changes animate unless reduced motion is requested.'
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
			name: 'closeOnBackdrop',
			type: 'boolean',
			required: false,
			default: 'false',
			description:
				'A backdrop press-and-click requests cancellation when dismissible. Native onclick or oncancel can prevent it.'
		},
		{
			name: 'glass',
			type: 'boolean',
			required: false,
			default: 'true',
			description:
				'Translucent surface and blur; false uses an opaque theme background. Backdrop blur is unchanged.'
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

{#snippet previewFooter()}<Button label="Done" onClick={() => (previewOpen = false)} />{/snippet}

{#snippet customFooter()}
	<Button label="Done" onClick={() => (snippetOpen = false)} />
{/snippet}

<Page title={chapter} description="Present modal content with native focus and accessible naming.">
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<p>Open a modal with a named header and a body snippet.</p>
		<div><Button label="Open dialog" onClick={() => (open = true)} /></div>
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
	<Section {...sections.find((section) => section.id === 'surfaces')!}>
		<p>
			Choose an opaque surface for readable content over a busy page. Glass remains available;
			backdrop blur is independent.
		</p>
		{#each [true, false] as glass (glass)}
			<Button
				label={glass ? 'Open glass dialog' : 'Open opaque dialog'}
				onClick={() => {
					previewGlass = glass;
					previewOpen = true;
				}}
			/>
		{/each}
		<CodeSnippet
			source={'<Dialog bind:open header={{ title: "Details" }} glass={false}>Content</Dialog>'}
			label="Opaque Dialog usage"
		/>
	</Section>
	<Section {...sections.find((section) => section.id === 'header-motion')!}>
		<p>Title and icon changes enter together. Reduced motion skips the entrance.</p>
		<Button label="Open header animation" onClick={() => (headerMotionOpen = true)} />
		<Dialog
			bind:open={headerMotionOpen}
			header={{
				title: headerSaved ? 'Details saved' : 'Review details',
				icon: { name: headerSaved ? 'check_circle' : 'edit' }
			}}
		>
			<p>Change the header without closing the dialog.</p>
			<Button
				label={headerSaved ? 'Reset header' : 'Save demo changes'}
				icon={{ name: headerSaved ? 'refresh' : 'save' }}
				onClick={() => (headerSaved = !headerSaved)}
			/>
		</Dialog>
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={reset}>
			{#snippet preview()}<div data-dialog-stage>
					<p>Open the modal to test its current settings and native focus behavior.</p>
					<Button label="Open preview dialog" onClick={() => (previewOpen = true)} />
				</div>{/snippet}
			{#snippet status()}<span role="status">
					{previewOpen ? 'Open' : 'Closed'} · {previewEvent}; close events: {previewCloseCount};
					cancel events: {previewCancelCount}
				</span>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="dialog-previewGlass" label="Glass surface" toggle>
					<Checkbox id="dialog-previewGlass" bind:checked={previewGlass} />
				</PlaygroundField>
				<PlaygroundField id="dialog-previewSize" label="Size">
					<Select
						id="dialog-previewSize"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => previewSize, (next) => (previewSize = next as typeof previewSize)}
					/>
				</PlaygroundField>
				<PlaygroundField id="dialog-previewCloseOnBackdrop" label="Backdrop dismissal" toggle>
					<Checkbox id="dialog-previewCloseOnBackdrop" bind:checked={previewCloseOnBackdrop} />
				</PlaygroundField>
				<PlaygroundField id="dialog-previewDismissible" label="Dismissible" toggle>
					<Checkbox id="dialog-previewDismissible" bind:checked={previewDismissible} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Header">
				<PlaygroundField id="dialog-headerTitle" label="Title">
					<TextInput id="dialog-headerTitle" bind:value={headerTitle} />
				</PlaygroundField>
				<PlaygroundField id="dialog-headerDescription" label="Description">
					<TextInput id="dialog-headerDescription" bind:value={headerDescription} />
				</PlaygroundField>
				<PlaygroundField id="dialog-headerIcon" label="Header icon" toggle>
					<Checkbox id="dialog-headerIcon" bind:checked={headerIcon} />
				</PlaygroundField>
				<PlaygroundField id="dialog-headerIconName" label="Icon name">
					<Select
						id="dialog-headerIconName"
						items={iconNames.map((id) => ({ id, label: id }))}
						bind:value={() => headerIconName, (next) => (headerIconName = next as IconName)}
					/>
				</PlaygroundField>
				<PlaygroundField id="dialog-headerIconFilled" label="Filled icon" toggle>
					<Checkbox id="dialog-headerIconFilled" bind:checked={headerIconFilled} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Content">
				<PlaygroundField id="dialog-bodyMode" label="Body content">
					<Select
						id="dialog-bodyMode"
						items={bodyModes.map((id) => ({ id, label: id }))}
						bind:value={() => bodyMode, (next) => (bodyMode = next as typeof bodyMode)}
					/>
				</PlaygroundField>
				<PlaygroundField id="dialog-footerMode" label="Footer">
					<Select
						id="dialog-footerMode"
						items={footerModes.map((id) => ({ id, label: id }))}
						bind:value={() => footerMode, (next) => (footerMode = next as typeof footerMode)}
					/>
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Footer actions">
				<PlaygroundField id="dialog-previewColor" label="Primary color">
					<Select
						id="dialog-previewColor"
						items={colors.map((id) => ({ id, label: id }))}
						bind:value={() => previewColor, (next) => (previewColor = next as typeof previewColor)}
					/>
				</PlaygroundField>
				<PlaygroundField id="dialog-primaryLabel" label="Primary label">
					<TextInput id="dialog-primaryLabel" bind:value={primaryLabel} />
				</PlaygroundField>
				<PlaygroundField id="dialog-secondaryLabel" label="Secondary label">
					<TextInput id="dialog-secondaryLabel" bind:value={secondaryLabel} />
				</PlaygroundField>
				<PlaygroundField id="dialog-actionIcon" label="Primary icon" toggle>
					<Checkbox id="dialog-actionIcon" bind:checked={actionIcon} />
				</PlaygroundField>
				<PlaygroundField id="dialog-primaryDisabled" label="Primary disabled" toggle>
					<Checkbox id="dialog-primaryDisabled" bind:checked={primaryDisabled} />
				</PlaygroundField>
				<PlaygroundField id="dialog-secondaryDisabled" label="Secondary disabled" toggle>
					<Checkbox id="dialog-secondaryDisabled" bind:checked={secondaryDisabled} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
		<Dialog
			bind:open={previewOpen}
			header={previewHeader}
			size={previewSize}
			dismissible={previewDismissible}
			glass={previewGlass}
			closeOnBackdrop={previewCloseOnBackdrop}
			footer={footerMode === 'actions'
				? previewActions
				: footerMode === 'snippet'
					? previewFooter
					: undefined}
			onclose={() => {
				previewEvent = 'Closed';
				previewCloseCount++;
			}}
			oncancel={() => {
				previewEvent = 'Cancel event';
				previewCancelCount++;
			}}
		>
			{#if bodyMode === 'form'}<label for="dialog-preview-name">Display name</label>
				<TextInput id="dialog-preview-name" value="Example name" />
			{:else if bodyMode === 'long'}{#each Array.from({ length: 12 }, (_, index) => index + 1) as note (note)}<p
					>
						Note {note}. Review the complete details before saving changes.
					</p>{/each}
			{:else}<p>Review the details before saving changes.</p>{/if}
			<Button label="Close via binding" onClick={() => (previewOpen = false)} />
		</Dialog>
	</Section>
	<Section {...sections.find((section) => section.id === 'dismissal')!}>
		<p>
			Tab remains inside the modal. Escape and the close button follow the dismissible control. Opt
			into closeOnBackdrop to dismiss after a press and click outside the panel; dragging from
			inside leaves it open. Backdrop dismissal emits a cancel event, which can be prevented. Close
			from the caller by setting the state bound to <code>open</code>
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
			closeOnBackdrop
		>
			<Button label="Close via binding" onClick={() => (dismissalOpen = false)} />
		</Dialog>
	</Section>
	<Section {...sections.find((section) => section.id === 'actions')!}>
		<p>
			Choose a size and status color, then test the two action callbacks. Small screens always use
			full-screen.
		</p>
		<div data-control>
			<label for="dialog-selectedSize">Size</label>
			<Select
				id="dialog-selectedSize"
				items={sizes.map((id) => ({ id, label: id }))}
				bind:value={() => selectedSize, (next) => (selectedSize = next as typeof selectedSize)}
			/>
		</div>
		<div data-control>
			<label for="dialog-selectedColor">Action color</label>
			<Select
				id="dialog-selectedColor"
				items={colors.map((id) => ({ id, label: id }))}
				bind:value={() => selectedColor, (next) => (selectedColor = next as typeof selectedColor)}
			/>
		</div>
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
	<Section {...sections.find((section) => section.id === 'scrolling')!}>
		<p>Long content scrolls inside the panel while the header stays available.</p>
		<Button label="Open long content" onClick={() => (longOpen = true)} />
		<Dialog
			bind:open={longOpen}
			header={{ title: 'Review the details', description: 'Scroll through the complete notes.' }}
			size="small"
		>
			{#each Array.from({ length: 12 }, (_, index) => index + 1) as note (note)}
				<p>
					Note {note}. Keep the information you need together. This longer example lets you review
					the content at your own pace, with the dialog title and close action still in reach.
				</p>
			{/each}
		</Dialog>
	</Section>
	<Section {...sections.find((section) => section.id === 'props')!}>
		<PropTable {props} />
		<p>
			The header title and optional description supply accessible names. Native dialog attributes,
			close and cancel events are forwarded. The body and optional footer accept snippets.
		</p>
	</Section>
</Page>

<style>
	[data-dialog-stage] {
		display: grid;
		justify-items: start;
		gap: 20px;
	}
	label {
		display: grid;
		gap: 0.5rem;
		margin-block: 0.75rem;
	}
	label[data-checkbox-control] {
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
