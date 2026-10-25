import type { ExportNamedDeclaration, ExportSpecifier, Pattern } from 'estree';

/**
 * Read an AST identifier or string-literal name, including TypeScript declaration IDs.
 * @param node Parser node with a name or string value, or an absent declaration name.
 * @returns The name, or null when the node does not identify a public name.
 */
export const readName = (node: unknown): string | null => {
	if (typeof node !== 'object' || node === null) return null;
	if ('name' in node && typeof node.name === 'string') return node.name;
	return 'value' in node && typeof node.value === 'string' ? node.value : null;
};

/**
 * Find a module path only for a direct runtime default re-export.
 * @param declaration Export list containing the specifier and optional module path.
 * @param specifier Named export such as default as Button.
 * @returns Module path, or null for type-only, named or local exports.
 */
export const readDefaultReExportPath = (
	declaration: ExportNamedDeclaration,
	specifier: ExportSpecifier
): string | null => {
	if (
		('exportKind' in declaration && declaration.exportKind === 'type') ||
		('exportKind' in specifier && specifier.exportKind === 'type') ||
		readName(specifier.local) !== 'default'
	)
		return null;
	const module = declaration.source?.value;
	return typeof module === 'string' ? module : null;
};

/**
 * Read variable names from identifiers, defaults, rest and nested destructuring patterns.
 * @param binding Variable binding pattern from an exported declaration.
 * @returns Declared names in source order, skipping omitted array elements.
 */
export const readBindingNames = (binding: Pattern): string[] => {
	if (binding.type === 'Identifier') return [binding.name];
	if (binding.type === 'AssignmentPattern') return readBindingNames(binding.left);
	if (binding.type === 'RestElement') return readBindingNames(binding.argument);
	if (binding.type === 'ObjectPattern')
		return binding.properties.flatMap((property) =>
			readBindingNames(
				property.type === 'RestElement' ? property.argument : (property.value as Pattern)
			)
		);
	if (binding.type === 'ArrayPattern')
		return binding.elements.flatMap((element) =>
			element === null ? [] : readBindingNames(element)
		);
	return [];
};
