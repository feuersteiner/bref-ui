export const sharedRules = {
	'func-style': ['error', 'expression'],
	curly: ['error', 'multi'],
	'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
	'no-restricted-syntax': [
		'error',
		{
			selector: 'MethodDefinition[kind="method"]',
			message: 'Use an arrow-function class field instead of a class method.'
		},
		{
			selector: 'PropertyDefinition[value.type="FunctionExpression"]',
			message: 'Use an arrow function for callable class fields.'
		}
	],
	'padding-line-between-statements': [
		'error',
		{ blankLine: 'never', prev: 'import', next: 'import' }
	],
	'@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
	'@typescript-eslint/consistent-type-imports': [
		'error',
		{ prefer: 'type-imports', fixStyle: 'separate-type-imports' }
	],
	'@typescript-eslint/naming-convention': [
		'error',
		{ selector: 'enum', format: ['PascalCase'], suffix: ['Enum'] },
		{ selector: 'typeLike', format: ['PascalCase'] }
	],
	'max-lines': ['error', { max: 159, skipBlankLines: true, skipComments: true }]
};

export const svelteRules = {
	'svelte/consistent-selector-style': ['error', { style: ['type', 'class'], checkGlobal: false }],
	'svelte/no-unused-class-name': 'error'
};

export const filenameRules = {
	'check-file/filename-naming-convention': [
		'error',
		{ '**/*.{js,ts,svelte}': 'KEBAB_CASE' },
		{ ignoreMiddleExtensions: true }
	],
	'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }]
};
