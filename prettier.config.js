/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	htmlWhitespaceSensitivity: 'ignore',
	plugins: ['prettier-plugin-svelte'],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};

export default config;
