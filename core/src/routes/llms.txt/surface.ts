export default {
	props:
		"as?: 'div' | 'section' | 'span' = div; children?: Snippet; color?: Color = background; variant?: Variant = neutral; spacing?: Size; orientation?: Orientation = vertical; width?: Dimension = fill; height?: Dimension = fit; radius?: Size | `${number}rem` | `${number}%` = Omitted (0); shadow?: BaseSize | boolean = false; hover?: BaseSize; scroll?: boolean = false; glass?: boolean = false",
	purpose: 'Group content in themed containers.',
	example: '<Surface spacing="medium" radius="small">Content</Surface>'
};
