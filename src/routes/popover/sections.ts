export const chapter = 'Popover';

export const sections = [
	{ id: 'usage', title: 'Usage' },
	{ id: 'bound-state', title: 'Bound state' },
	{ id: 'viewport', title: 'Scrolling and multiple instances' },
	{ id: 'props', title: 'Props' },
	{ id: 'keyboard', title: 'Keyboard and focus' }
] as const;

export const props = [
	{
		name: 'trigger',
		type: 'Snippet<[PopoverTriggerProps]>',
		required: true,
		default: '—',
		description: 'Render a native control and spread its generated attributes and attachment.'
	},
	{
		name: 'children',
		type: 'Snippet',
		required: true,
		default: '—',
		description: 'Parameterless content inside the popover.'
	},
	{
		name: 'open',
		type: 'boolean',
		required: false,
		default: 'false',
		description: 'Bindable open state; managed internally when unbound.'
	}
];
