export default {
	props: 'size?: Size = medium; checked?: boolean = false',
	purpose: 'Use for independent checked or unchecked form choices.',
	setup: 'let checked = $state(false);',
	example: '<label><Checkbox bind:checked /> Accept terms</label>'
};
