<script lang="ts">
	import { componentDocs } from 'bref-ui/docs';
	import ComponentUsage from '../components/component-usage.svelte';
	/* eslint-disable max-lines -- Keep the trigger composition examples and their documentation together. */
	import { resolve } from '$app/paths';
	import { chapter, sections } from './sections.js';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import MovingBackground from '../components/moving-background.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Popover, TextInput, Checkbox, Button, Select } from 'bref-ui';

	import type { PopoverProps } from 'bref-ui/types';

	const doc = componentDocs['popover'];
	const props = doc.props;

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
	let previewOpen = $state(false);
	let previewDisabled = $state(false);
	let element = $state<NonNullable<PopoverProps['as']>>('div');
	let previewVariant = $state<NonNullable<PopoverProps['variant']>>('soft');
	let previewColor = $state<NonNullable<PopoverProps['color']>>('background');
	let shadow = $state('medium');
	let hover = $state('none');
	let spacing = $state<NonNullable<PopoverProps['spacing']>>('medium');
	let orientation = $state<NonNullable<PopoverProps['orientation']>>('vertical');
	let width = $state('default');
	let height = $state('default');
	let radius = $state<NonNullable<PopoverProps['radius']>>('small');
	let scroll = $state(false);
	let className = $state('');
	let inlineStyle = $state('');
	let content = $state('short');
	let triggerWide = $state(false);
	let movingBackground = $state(false);
	const elements = ['div', 'section', 'span'] as const;
	const variants = ['neutral', 'soft', 'filled'] as const;
	const colors = [
		'primary',
		'secondary',
		'foreground',
		'background',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	] as const;
	const shadows = ['false', 'true', 'small', 'medium', 'large'] as const;
	const hovers = ['none', 'small', 'medium', 'large'] as const;
	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const orientations = ['horizontal', 'vertical'] as const;
	const dimensions = ['default', 'fit', 'fill'] as const;
	const radii = [...sizes, '0rem', '1.5rem', '50%'] as const;
	const contents = ['short', 'form', 'long'] as const;
	const previewShadow = $derived(
		shadow === 'false'
			? false
			: shadow === 'true'
				? true
				: (shadow as NonNullable<PopoverProps['shadow']>)
	);

	const previewHover = $derived(hover === 'none' ? undefined : (hover as PopoverProps['hover']));
	const previewWidth = $derived(width === 'default' ? undefined : (width as PopoverProps['width']));
	const previewHeight = $derived(
		height === 'default' ? undefined : (height as PopoverProps['height'])
	);

	const reset = () => {
		previewOpen = false;
		previewDisabled = false;
		element = 'div';
		previewVariant = 'soft';
		previewColor = 'background';
		shadow = 'medium';
		hover = 'none';
		spacing = 'medium';
		orientation = 'vertical';
		width = 'default';
		height = 'default';
		radius = 'small';
		scroll = false;
		className = '';
		inlineStyle = '';
		content = 'short';
		triggerWide = false;
		movingBackground = false;
	};
	const playgroundSource = $derived(`<script>
  import { Button, Popover, TextInput } from 'bref-ui';
  let open = $state(false);
<${'/'}script>

<Popover bind:open disabled={${previewDisabled}} as="${element}" variant="${previewVariant}" color="${previewColor}"
  shadow={${JSON.stringify(previewShadow)}}${previewHover ? ` hover="${previewHover}"` : ''} spacing="${spacing}" orientation="${orientation}"${previewWidth ? ` width="${previewWidth}"` : ''}${previewHeight ? ` height="${previewHeight}"` : ''}
  radius="${radius}" scroll={${scroll}}${className ? ` class={${JSON.stringify(className)}}` : ''}${inlineStyle ? ` style={${JSON.stringify(inlineStyle)}}` : ''}>
  {#snippet trigger()}
    <Button label="Toggle preview popover" wide={${triggerWide}} disabled={${previewDisabled}}
      aria-expanded={open} onClick={() => open = !open} />
  {/snippet}
${content === 'form' ? '  <label for="popover-preview-name">Display name</label>\n  <TextInput id="popover-preview-name" value="Example" />' : content === 'long' ? '  {#each Array.from({ length: 18 }, (_, index) => index + 1) as detail (detail)}\n    <p>Detail {detail}. Longer content helps test height and scrolling.</p>\n  {/each}' : '  <p>Helpful details beside the trigger.</p>'}
  <Button label="Done" onClick={() => open = false} />
</Popover>
<p role="status">{open ? 'Open' : 'Closed'}</p>`);
</script>

<Page title={chapter} description={doc.description}>
	<Section {...sections.find((section) => section.id === 'usage')!}>
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
		<ComponentUsage usage={doc.usage} />
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={reset}>
			{#snippet preview()}<div data-playground-stage>
					{#if movingBackground}<MovingBackground />{/if}
					<div data-playground-content>
						<Popover
							bind:open={previewOpen}
							disabled={previewDisabled}
							as={element}
							variant={previewVariant}
							color={previewColor}
							shadow={previewShadow}
							hover={previewHover}
							{spacing}
							{orientation}
							width={previewWidth}
							height={previewHeight}
							{radius}
							{scroll}
							class={className}
							style={inlineStyle}
						>
							{#snippet trigger()}<Button
									label="Toggle preview popover"
									wide={triggerWide}
									disabled={previewDisabled}
									aria-expanded={previewOpen}
									onClick={() => (previewOpen = !previewOpen)}
								/>
							{/snippet}

							{#if content === 'form'}
								<label for="popover-preview-name">Display name</label>
								<TextInput id="popover-preview-name" value="Example" />
							{:else if content === 'long'}
								{#each Array.from({ length: 18 }, (_, index) => index + 1) as detail (detail)}
									<p>Detail {detail}. Longer content helps test height and scrolling.</p>
								{/each}
							{:else}
								<p>Helpful details beside the trigger.</p>
							{/if}

							<Button label="Done" onClick={() => (previewOpen = false)} />
						</Popover>
					</div>
				</div>{/snippet}
			{#snippet status()}<span role="status">
					{previewOpen && !previewDisabled ? 'Open' : 'Closed'} · Glass is always enabled
				</span>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="popover-previewVariant" label="Variant">
					<Select
						id="popover-previewVariant"
						items={variants.map((id) => ({ id, label: id }))}
						bind:value={
							() => previewVariant, (next) => (previewVariant = next as typeof previewVariant)
						}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-previewColor" label="Color">
					<Select
						id="popover-previewColor"
						items={colors.map((id) => ({ id, label: id }))}
						bind:value={() => previewColor, (next) => (previewColor = next as typeof previewColor)}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-shadow" label="Shadow">
					<Select
						id="popover-shadow"
						items={shadows.map((id) => ({ id, label: id }))}
						bind:value={() => shadow, (next) => (shadow = next as typeof shadow)}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-hover" label="Hover treatment">
					<Select
						id="popover-hover"
						items={hovers.map((id) => ({ id, label: id }))}
						bind:value={() => hover, (next) => (hover = next as typeof hover)}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-radius" label="Radius">
					<Select
						id="popover-radius"
						items={radii.map((id) => ({ id, label: id }))}
						bind:value={() => radius, (next) => (radius = next as typeof radius)}
					/>
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Layout">
				<PlaygroundField id="popover-element" label="Root element">
					<Select
						id="popover-element"
						items={elements.map((id) => ({ id, label: id }))}
						bind:value={() => element, (next) => (element = next as typeof element)}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-spacing" label="Spacing">
					<Select
						id="popover-spacing"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => spacing, (next) => (spacing = next as typeof spacing)}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-orientation" label="Orientation">
					<Select
						id="popover-orientation"
						items={orientations.map((id) => ({ id, label: id }))}
						bind:value={() => orientation, (next) => (orientation = next as typeof orientation)}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-width" label="Width">
					<Select
						id="popover-width"
						items={dimensions.map((id) => ({ id, label: id }))}
						bind:value={() => width, (next) => (width = next as typeof width)}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-height" label="Height">
					<Select
						id="popover-height"
						items={dimensions.map((id) => ({ id, label: id }))}
						bind:value={() => height, (next) => (height = next as typeof height)}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-scroll" label="Scroll" toggle>
					<Checkbox id="popover-scroll" bind:checked={scroll} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Customization">
				<PlaygroundField id="popover-className" label="Surface class">
					<TextInput id="popover-className" bind:value={className} />
				</PlaygroundField>
				<PlaygroundField id="popover-inlineStyle" label="Surface inline style">
					<TextInput id="popover-inlineStyle" bind:value={inlineStyle} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="Preview">
				<PlaygroundField id="popover-content" label="Content">
					<Select
						id="popover-content"
						items={contents.map((id) => ({ id, label: id }))}
						bind:value={() => content, (next) => (content = next as typeof content)}
					/>
				</PlaygroundField>
				<PlaygroundField id="popover-previewDisabled" label="Disabled" toggle>
					<Checkbox id="popover-previewDisabled" bind:checked={previewDisabled} />
				</PlaygroundField>
				<PlaygroundField id="popover-triggerWide" label="Wide trigger" toggle>
					<Checkbox id="popover-triggerWide" bind:checked={triggerWide} />
				</PlaygroundField>
				<PlaygroundField id="popover-movingBackground" label="Moving background" toggle>
					<Checkbox id="popover-movingBackground" bind:checked={movingBackground} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
		<p>
			Open the preview after changing settings. Width fill follows the trigger; fit and default
			follow content. Every panel uses glass.
		</p>
	</Section>
	<Section {...sections.find((section) => section.id === 'bound-state')!}>
		<div data-controls>
			<Popover bind:open variant="filled" spacing="medium" radius="small" shadow scroll>
				{#snippet trigger()}
					<Button label="Edit settings" onClick={() => (open = !open)} aria-expanded={open} />
				{/snippet}

				<label>Display name <TextInput value="Example" /></label>
				<Button label="Done" onClick={() => (open = false)} />
			</Popover>

			<Button label="Open programmatically" onClick={() => (open = true)} />

			<Button label="Close programmatically" onClick={() => (open = false)} />
		</div>
		<p role="status">Settings {open ? 'open' : 'closed'}.</p>
	</Section>
	<Section {...sections.find((section) => section.id === 'viewport')!}>
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

	<Section {...sections.find((section) => section.id === 'props')!}>
		<PropTable {props} />

		<p>
			Popover accepts
			<a href={resolve('surface#props')}>Surface props</a>
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
	<Section {...sections.find((section) => section.id === 'keyboard')!}>
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

	<Section {...sections.find((section) => section.id === 'content-fit')!}>
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
					Unbroken tokens wrap only when needed:

					<code>
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
	[data-playground-stage] {
		position: relative;
		isolation: isolate;
		display: grid;
		align-content: center;
		gap: 20px;
		min-width: 0;
		min-height: 240px;
		padding: 24px;
	}
	[data-playground-content] {
		position: relative;
		min-width: 0;
	}

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
