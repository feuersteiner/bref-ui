// One compact reference per public component; keep props aligned with the page props array.
export const componentUsage: Record<
	string,
	{ purpose: string; setup?: string; example: string; props: string }
> = {
	Button: {
		props:
			"href: string (for links); label: string (for text buttons); icon: Omit<IconProps, 'size' | 'color'> (for icon-only buttons); size?: Size = medium; variant?: Variant = neutral; color?: Exclude<Color, 'background'> = foreground; trailingIcon?: Omit<IconProps, 'size' | 'color'>; wide?: boolean = false; rounded?: boolean = false; glass?: boolean = false; disabled?: boolean = false; onClick?: MouseEvent handler",
		purpose: 'Use for actions or navigation.',
		example: '<Button label="Save" onClick={() => console.log("Saved")} />'
	},
	Icon: {
		props:
			'name: IconName; filled?: boolean = false; label?: string; size?: Size = Inherited; color?: Color = Inherited',
		purpose: 'Use Material Symbols for icons; load their font through Theme.',
		example: '<Icon name="search" label="Search" />'
	},
	Theme: {
		props: 'palette?: Palette | { dark: Palette; light: Palette } = {}; children?: Snippet',
		purpose: 'Set up palettes, resets and icon fonts at the app root.',
		example: '<Theme />'
	},
	ThemeModeToggle: {
		props: 'mode?: ThemeMode = auto',
		purpose: 'Set color-scheme metadata for an app theme control.',
		example: '<ThemeModeToggle mode="dark" />'
	},
	Surface: {
		props:
			"as?: 'div' | 'section' | 'span' = div; children?: Snippet; color?: Color = background; variant?: Variant = neutral; spacing?: Size; orientation?: Orientation = vertical; width?: Dimension = fill; height?: Dimension = fit; radius?: Size | `${number}rem` | `${number}%` = Omitted (0); shadow?: BaseSize | boolean = false; hover?: BaseSize; scroll?: boolean = false; glass?: boolean = false",
		purpose: 'Group content in themed containers.',
		example: '<Surface spacing="medium" radius="small">Content</Surface>'
	},
	Checkbox: {
		props: 'size?: Size = medium; checked?: boolean = false',
		purpose: 'Use for independent checked or unchecked form choices.',
		setup: 'let checked = $state(false);',
		example: '<label><Checkbox bind:checked /> Accept terms</label>'
	},
	Switch: {
		props: 'checked?: boolean = false; size?: BaseSize = medium; children?: Snippet',
		purpose: 'Use for on/off settings.',
		setup: 'let checked = $state(false);',
		example: '<label><Switch bind:checked /> Notifications</label>'
	},
	TextInput: {
		props:
			"value?: string; onChange?: (value: string) => void; icon?: IconProps; size?: BaseSize = medium; variant?: Exclude<Variant, 'filled'> = soft; glass?: boolean = false; wide?: boolean = false",
		purpose: 'Collect single-line text.',
		example: '<label>Name <TextInput name="name" placeholder="Your name" /></label>'
	},
	TextArea: {
		props:
			"value?: string; onChange?: (value: string) => void; icon?: IconProps; size?: BaseSize = medium; variant?: Exclude<Variant, 'filled'> = soft; glass?: boolean = false; wide?: boolean = false; resizable?: boolean = true",
		purpose: 'Collect multiline text.',
		example: '<label>Message <TextArea name="message" rows={3} /></label>'
	},
	Progress: {
		props:
			'label?: string; value?: number; onSeek?: (value: number) => void; disabled?: boolean = false; size?: BaseSize = medium',
		purpose: 'Show determinate or indeterminate progress.',
		example: '<Progress value={0.4} label="Upload progress" />'
	},
	Spinner: {
		props: 'label?: string; size?: Size = Inherited',
		purpose: 'Indicate pending work.',
		example: '<Spinner label="Loading results" />'
	},
	Pill: {
		props:
			"label: string; icon?: Omit<IconProps, 'label' | 'size' | 'color'>; children?: Snippet; size?: Size = medium; variant?: Variant = neutral; color?: Exclude<Color, 'background'> = foreground; onClick?: (event: MouseEvent) => void; onDelete?: () => void; wide?: boolean = false; swoosh?: boolean = false; glass?: boolean = false",
		purpose: 'Label statuses or categories.',
		example: '<Pill label="Draft" />'
	},
	PillGroup: {
		props:
			"items: readonly PillDataProps[]; onDelete?: (id: string) => void; size?: Size = medium; variant?: Variant = neutral; color?: Exclude<Color, 'background'> = foreground; glass?: boolean = false",
		purpose: 'Group related status or category labels.',
		example: '<PillGroup items={[{ id: "draft", label: "Draft" }]} aria-label="Status" />'
	},
	PillChoiceGroup: {
		props:
			"items: readonly PillDataProps[]; selection: string | string[]; disabled?: boolean = false; onDelete?: (id: string) => void; size?: Size = medium; variant?: Exclude<Variant, 'filled'> = neutral; color?: Exclude<Color, 'background'> = foreground; animateSelected?: boolean = false; glass?: boolean = false",
		purpose: 'Choose one or more options displayed as Pills.',
		setup: 'let selection = $state("focus");',
		example:
			'<PillChoiceGroup items={[{ id: "focus", label: "Focus" }]} bind:selection aria-label="Mood" />'
	},
	Select: {
		props:
			"items: readonly SelectOptionDataProps[]; value?: string | string[]; onChange?: (value: string | string[]) => void; id?: string; placeholder?: string = Select…; emptyMessage?: SelectEmptyProps = { message: 'No options found' }; size?: BaseSize = medium; disabled?: boolean = false",
		purpose: 'Choose labeled options from a dropdown.',
		setup: 'let value = $state<string>();',
		example:
			'<label for="fruit">Fruit</label>\n<Select id="fruit" items={[{ id: "apple", label: "Apple" }]} bind:value />'
	},
	Combobox: {
		props:
			"items: readonly SelectOptionDataProps[]; value?: string | string[]; onChange?: (value: string | string[]) => void; id?: string = Generated; placeholder?: string = Select…; emptyMessage?: SelectEmptyProps = { message: 'No options found' }; size?: BaseSize = medium; disabled?: boolean = false; variant?: Exclude<Variant, 'filled'> = soft; wide?: boolean = false",
		purpose: 'Search and choose labeled options.',
		setup: 'let value = $state<string>();',
		example: '<Combobox items={[{ id: "apple", label: "Apple" }]} bind:value aria-label="Fruit" />'
	},
	TreeView: {
		props:
			'items: TreeItemProps[]; sections?: TreeSectionProps[] = []; label?: string = Tree view; size?: BaseSize = medium; glass?: boolean = false; selection?: string | string[]; defaultExpanded?: boolean = false; onDelete?: (id: string) => void; node?: Snippet<[TreeItemProps]>',
		purpose: 'Navigate or select nested items.',
		example:
			'<TreeView items={[{ id: "files", label: "Files", children: [{ id: "notes", label: "Notes" }] }]} label="Files" />'
	},
	Dialog: {
		props:
			"header: DialogHeaderDataProps; children: Snippet; open?: boolean = false; footer?: Snippet | { primary: DialogActionProps; secondary: DialogActionProps }; dismissible?: boolean = true; size?: Size | 'full-screen' = medium",
		purpose: 'Present modal content or forms.',
		setup: 'let open = $state(false);',
		example:
			'<button onclick={() => open = true}>Open</button>\n<Dialog bind:open header={{ title: "Details" }}>Content</Dialog>'
	},
	Popover: {
		props:
			"trigger: Snippet; children: Snippet; open?: boolean = false; disabled?: boolean = false; as?: 'div' | 'section' | 'span' = div; variant?: Variant = soft; color?: Color = background; shadow?: BaseSize | boolean = medium; hover?: BaseSize; spacing?: Size = medium; orientation?: Orientation = vertical; width?: Dimension; height?: Dimension; radius?: SurfaceRadius = small; scroll?: boolean = false; class?: string; style?: string",
		purpose: 'Show content anchored to a trigger.',
		setup: 'let open = $state(false);',
		example:
			'<Popover bind:open>\n  {#snippet trigger()}\n    <button onclick={() => open = !open} aria-expanded={open}>Details</button>\n  {/snippet}\n  Content\n</Popover>'
	}
};
