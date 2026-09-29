import ts from 'typescript';

/**
 * Find the module path only when a specifier re-exports default as a runtime value.
 * Type-only exports, named exports and local export lists cannot identify an installed
 * component file and therefore return null.
 * @param declaration Export statement containing the specifier and optional module path.
 * @param specifier One item from its named export list, such as default as Button.
 * @returns The direct default re-export's module path, or null for other export forms.
 */
export const readDefaultReExportPath = (
	declaration: ts.ExportDeclaration,
	specifier: ts.ExportSpecifier
): string | null => {
	if (declaration.isTypeOnly || specifier.isTypeOnly) return null;
	const originalName = specifier.propertyName ?? specifier.name;
	if (originalName.text !== 'default') return null;
	const module = declaration.moduleSpecifier;
	if (!module || !ts.isStringLiteral(module)) return null;
	return module.text;
};

/**
 * Read variable names from identifiers and nested destructuring patterns.
 * For example, { source: Button } declares Button, while [, Icon] declares only Icon.
 * @param binding Variable identifier or object/array binding pattern.
 * @returns Declared variable names in source order, skipping omitted array elements.
 */
export const readBindingNames = (binding: ts.BindingName): string[] => {
	if (ts.isIdentifier(binding)) return [binding.text];
	return binding.elements.flatMap((element) =>
		ts.isBindingElement(element) ? readBindingNames(element.name) : []
	);
};
