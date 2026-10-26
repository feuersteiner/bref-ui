export default {
	props:
		"label: string; icon?: Omit<IconProps, 'label' | 'size' | 'color'>; children?: Snippet; size?: Size = medium; variant?: Variant = neutral; color?: Exclude<Color, 'background'> = foreground; onClick?: (event: MouseEvent) => void; onDelete?: () => void; wide?: boolean = false; swoosh?: boolean = false; glass?: boolean = false",
	purpose: 'Label statuses or categories.',
	example: '<Pill label="Draft" />'
};
