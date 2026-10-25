export default {
	props: 'checked?: boolean = false; size?: BaseSize = medium; children?: Snippet',
	purpose: 'Use for on/off settings.',
	setup: 'let checked = $state(false);',
	example: '<label><Switch bind:checked /> Notifications</label>'
};
