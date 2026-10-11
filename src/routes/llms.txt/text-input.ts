export default {
	props:
		"value?: string; onChange?: (value: string) => void; icon?: IconProps; size?: BaseSize = medium; variant?: Exclude<Variant, 'filled'> = soft; glass?: boolean = false; wide?: boolean = false",
	purpose: 'Collect single-line text.',
	example: '<label>Name <TextInput name="name" placeholder="Your name" /></label>'
};
