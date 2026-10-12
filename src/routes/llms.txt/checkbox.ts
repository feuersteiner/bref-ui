export default {
	props: 'size?: Size = medium; checked?: boolean = false',
	purpose: 'Independent form choices with local, reduced-motion-aware checkmark transitions.',
	setup: 'let checked = $state(false);',
	example: '<label><Checkbox bind:checked /> Accept terms</label>'
};
