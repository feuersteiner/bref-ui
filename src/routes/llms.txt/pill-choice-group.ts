export default {
	props:
		"items: readonly PillDataProps[]; selection: string | string[]; disabled?: boolean = false; onDelete?: (id: string) => void; size?: Size = medium; variant?: Exclude<Variant, 'filled'> = neutral; color?: Exclude<Color, 'background'> = foreground; animateSelected?: boolean = false; glass?: boolean = false",
	purpose: 'Choose one or more options displayed as Pills.',
	setup: 'let selection = $state("focus");',
	example:
		'<PillChoiceGroup items={[{ id: "focus", label: "Focus" }]} bind:selection aria-label="Mood" />'
};
