import ts from 'typescript';

/**
 * Replace only the module text of relative, type-only imports.
 * @param content Script content to parse as TypeScript.
 * @param filename Source path included in preparation errors.
 * @returns Script text preserving import syntax, quotes, formatting and runtime imports.
 * @throws When a relative non-component import mixes type and value specifiers.
 */
export const rewriteImports = (content: string, filename: string): string => {
	const script = ts.createSourceFile(
		filename,
		content,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	);

	return script.statements.reduceRight((source, statement) => {
		if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
			return source;

		const module = statement.moduleSpecifier;
		if (!/^\.{1,2}\//.test(module.text) || module.text.endsWith('.svelte')) return source;

		const clause = statement.importClause;
		if (!clause) return source;

		const bindings = clause.namedBindings;
		const namedTypes = bindings && ts.isNamedImports(bindings) && bindings.elements;
		const onlyTypes =
			clause.isTypeOnly ||
			(!clause.name &&
				namedTypes &&
				namedTypes.length > 0 &&
				namedTypes.every((item) => item.isTypeOnly));

		if (!onlyTypes) {
			if (namedTypes && namedTypes.some((item) => item.isTypeOnly))
				throw new Error(`${filename}: separate type and value imports from "${module.text}".`);
			return source;
		}

		return (
			source.slice(0, module.getStart(script) + 1) + 'bref-ui/types' + source.slice(module.end - 1)
		);
	}, content);
};
