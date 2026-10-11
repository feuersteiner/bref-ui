// One minimal example per public component; prop tables come from the documentation pages.
export const componentUsage: Record<string, { purpose: string; setup?: string; example: string }> =
	{
		Button: {
			purpose: 'Use for actions or navigation.',
			example: '<Button label="Save" onClick={() => console.log("Saved")} />'
		},
		Icon: {
			purpose: 'Use Material Symbols for icons; load their font through Theme.',
			example: '<Icon name="search" label="Search" />'
		},
		Theme: {
			purpose: 'Set up palettes, resets and icon fonts at the app root.',
			example: '<Theme />'
		},
		ThemeModeToggle: {
			purpose: 'Set color-scheme metadata for an app theme control.',
			example: '<ThemeModeToggle mode="dark" />'
		},
		Surface: {
			purpose: 'Group content in themed containers.',
			example: '<Surface spacing="medium" radius="small">Content</Surface>'
		},
		Checkbox: {
			purpose: 'Use for independent checked or unchecked form choices.',
			setup: 'let checked = $state(false);',
			example: '<label><Checkbox bind:checked /> Accept terms</label>'
		},
		Switch: {
			purpose: 'Use for on/off settings.',
			setup: 'let checked = $state(false);',
			example: '<label><Switch bind:checked /> Notifications</label>'
		},
		TextInput: {
			purpose: 'Collect single-line text.',
			example: '<label>Name <TextInput name="name" placeholder="Your name" /></label>'
		},
		TextArea: {
			purpose: 'Collect multiline text.',
			example: '<label>Message <TextArea name="message" rows={3} /></label>'
		},
		Progress: {
			purpose: 'Show determinate or indeterminate progress.',
			example: '<Progress value={0.4} label="Upload progress" />'
		},
		Spinner: { purpose: 'Indicate pending work.', example: '<Spinner label="Loading results" />' },
		Pill: { purpose: 'Label statuses or categories.', example: '<Pill label="Draft" />' },
		PillGroup: {
			purpose: 'Group related status or category labels.',
			example: '<PillGroup items={[{ id: "draft", label: "Draft" }]} aria-label="Status" />'
		},
		PillChoiceGroup: {
			purpose: 'Choose one or more options displayed as Pills.',
			setup: 'let selection = $state("focus");',
			example:
				'<PillChoiceGroup items={[{ id: "focus", label: "Focus" }]} bind:selection aria-label="Mood" />'
		},
		Select: {
			purpose: 'Choose labeled options from a dropdown.',
			setup: 'let value = $state<string>();',
			example:
				'<label for="fruit">Fruit</label>\n<Select id="fruit" items={[{ id: "apple", label: "Apple" }]} bind:value />'
		},
		Combobox: {
			purpose: 'Search and choose labeled options.',
			setup: 'let value = $state<string>();',
			example:
				'<Combobox items={[{ id: "apple", label: "Apple" }]} bind:value aria-label="Fruit" />'
		},
		TreeView: {
			purpose: 'Navigate or select nested items.',
			example:
				'<TreeView items={[{ id: "files", label: "Files", children: [{ id: "notes", label: "Notes" }] }]} label="Files" />'
		},
		Dialog: {
			purpose: 'Present modal content or forms.',
			setup: 'let open = $state(false);',
			example:
				'<button onclick={() => open = true}>Open</button>\n<Dialog bind:open header={{ title: "Details" }}>Content</Dialog>'
		},
		Popover: {
			purpose: 'Show content anchored to a trigger.',
			setup: 'let open = $state(false);',
			example:
				'<Popover bind:open>\n  {#snippet trigger()}\n    <button onclick={() => open = !open} aria-expanded={open}>Details</button>\n  {/snippet}\n  Content\n</Popover>'
		}
	};
