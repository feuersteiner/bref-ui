// The first entry leaves every public token at Bref's actual defaults.
export const palettes = [
	{
		name: 'Default blue',
		primary: '#1d4ed8',
		darkPrimary: '#92b4df',
		background: '#f1eee7',
		darkBackground: '#18191c',
		foreground: '#151515',
		darkForeground: '#eceef2'
	},
	{
		name: 'Green',
		primary: '#34745a',
		darkPrimary: '#abc3a3',
		background: '#edf4ec',
		darkBackground: '#18231d',
		foreground: '#20372d',
		darkForeground: '#edf4ec'
	},
	{
		name: 'Red',
		primary: '#c51630',
		darkPrimary: '#df97a5',
		background: '#fbefed',
		darkBackground: '#271a1d',
		foreground: '#3c2026',
		darkForeground: '#fbefed'
	}
] as const;
