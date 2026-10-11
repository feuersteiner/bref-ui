export default {
	props:
		"value?: string; onChange?: (value: string) => void; icon?: IconProps; size?: BaseSize = medium; variant?: Exclude<Variant, 'filled'> = soft; glass?: boolean = false; wide?: boolean = false; resizable?: boolean = true",
	purpose: 'Collect multiline text.',
	example: '<label>Message <TextArea name="message" rows={3} /></label>'
};
