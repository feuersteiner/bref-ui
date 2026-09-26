import prettier from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';
import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import { filenameRules, sharedRules, svelteRules } from './eslint-rules.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');
const sourceFiles = ['**/*.{js,mjs,cjs,ts,mts,cts,svelte}'];

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	globalIgnores(['**/.output/**', '**/build/**', '**/dist/**']),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		files: sourceFiles,
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		linterOptions: { reportUnusedDisableDirectives: 'error' },
		rules: sharedRules
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		},
		rules: svelteRules
	},
	{
		files: sourceFiles,
		ignores: ['**/+*.{js,ts,svelte}'],
		plugins: { 'check-file': checkFile },
		rules: filenameRules
	}
);
