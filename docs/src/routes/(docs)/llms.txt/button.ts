export default {
	props:
		"href: string (for links); label: string (for text buttons); icon: Omit<IconProps, 'size' | 'color'> (for icon-only buttons); size?: Size = medium; variant?: Variant = neutral; color?: Exclude<Color, 'background'> = foreground; trailingIcon?: Omit<IconProps, 'size' | 'color'>; wide?: boolean = false; rounded?: boolean = false; glass?: boolean = false; disabled?: boolean = false; onClick?: MouseEvent handler",
	purpose: 'Use for actions or navigation.',
	example: '<Button label="Save" onClick={() => console.log("Saved")} />'
};
