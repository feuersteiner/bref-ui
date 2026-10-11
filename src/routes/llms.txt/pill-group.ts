export default {
	props:
		"items: readonly PillDataProps[]; onDelete?: (id: string) => void; size?: Size = medium; variant?: Variant = neutral; color?: Exclude<Color, 'background'> = foreground; glass?: boolean = false",
	purpose: 'Group related status or category labels.',
	example: '<PillGroup items={[{ id: "draft", label: "Draft" }]} aria-label="Status" />'
};
