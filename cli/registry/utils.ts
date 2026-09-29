import type { RegistryItem } from './types.js';

/**
 * Check for a lowercase kebab-case identifier beginning with a letter.
 * @param value Unvalidated manifest value.
 * @returns Whether the value is a valid component ID.
 */
const isId = (value: unknown): value is string =>
	typeof value === 'string' && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value);

/**
 * Check for a relative, slash-separated path without empty, dot or parent segments.
 * Backslashes and colons are rejected; filesystem symlinks are not resolved.
 * @param value Unvalidated manifest value.
 * @returns Whether the path satisfies the registry's lexical path rules.
 */
const isRelativeFile = (value: unknown): value is string =>
	typeof value === 'string' &&
	!value.includes('\\') &&
	!value.includes(':') &&
	value.split('/').every((part) => part !== '' && part !== '.' && part !== '..');

/**
 * Validate manifest fields, including unique files and dependencies and exports
 * referencing listed files. File existence and dependency graphs are checked later.
 * @param value Decoded JSON to validate.
 * @param manifest Manifest path used in error messages.
 * @returns The validated manifest object.
 * @throws When any required field has an invalid shape or value.
 */
export const parseItem = (value: unknown, manifest: string): RegistryItem => {
	if (typeof value !== 'object' || value === null || Array.isArray(value))
		throw new Error(`${manifest}: expected a registry item object.`);

	if (!('id' in value) || !isId(value.id))
		throw new Error(`${manifest}: "id" must be a kebab-case identifier.`);

	if (
		!('files' in value) ||
		!Array.isArray(value.files) ||
		value.files.length === 0 ||
		!value.files.every(isRelativeFile) ||
		new Set(value.files).size !== value.files.length
	)
		throw new Error(`${manifest}: "files" must contain unique relative file paths.`);
	const files = value.files;

	if (
		!('exports' in value) ||
		typeof value.exports !== 'object' ||
		value.exports === null ||
		Array.isArray(value.exports) ||
		Object.keys(value.exports).length === 0 ||
		!Object.entries(value.exports).every(
			([name, file]) =>
				/^[A-Z][a-zA-Z0-9]*$/.test(name) && typeof file === 'string' && files.includes(file)
		)
	)
		throw new Error(`${manifest}: "exports" must map component names to listed files.`);

	if (
		!('dependencies' in value) ||
		!Array.isArray(value.dependencies) ||
		!value.dependencies.every(isId) ||
		new Set(value.dependencies).size !== value.dependencies.length
	)
		throw new Error(`${manifest}: "dependencies" must contain unique component IDs.`);

	return value as RegistryItem;
};
