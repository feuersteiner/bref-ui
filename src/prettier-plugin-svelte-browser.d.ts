// prettier-plugin-svelte ships a standalone-compatible browser build without type declarations.
declare module 'prettier-plugin-svelte/browser' {
	import type { Plugin } from 'prettier';
	export const languages: NonNullable<Plugin['languages']>;
	export const options: NonNullable<Plugin['options']>;
	export const parsers: NonNullable<Plugin['parsers']>;
	export const printers: NonNullable<Plugin['printers']>;
}
