/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	htmlWhitespaceSensitivity: 'ignore',
	plugins: ['prettier-plugin-svelte'],
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{
			files: ['themes/src/lib/**/*.svelte', 'docs/src/routes/(themes)/**/*.svelte'],
			options: { htmlWhitespaceSensitivity: 'css' }
		}
	]
};

export default config;
