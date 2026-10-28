import type { Palette } from 'bref-ui/types';

// Site data only: components and token generation belong to bref-ui.
export const palettes = {
	relay: {
		primary: '#375b86',
		secondary: '#695985',
		background: '#f3f6fa',
		foreground: '#263346',
		muted: '#59677b',
		success: '#326b58'
	},
	forma: {
		primary: '#252a26',
		secondary: '#775a44',
		background: '#ffffff',
		foreground: '#252a26',
		muted: '#666b65',
		success: '#356747'
	},
	elsewhere: {
		primary: '#6250aa',
		secondary: '#54697a',
		background: '#f7f7fb',
		foreground: '#292739',
		muted: '#686575',
		success: '#386852'
	}
} satisfies Record<string, Palette>;

export type SitePalette = keyof typeof palettes;
