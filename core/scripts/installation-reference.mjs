import path from 'node:path';
import { planDependencies } from '../dist-cli/registry/plan/index.js';

/** Generate installation instructions exclusively from public exports and registry metadata. */
export const installationReference = (id, name, doc, registry, typeSymbols) => {
	const types = typeSymbols
		.filter(
			(symbol) =>
				symbol.name === `${name}Props` ||
				new RegExp(`\\b${symbol.name}\\b`).test(doc.usage) ||
				symbol.files.some((file) => file.includes(`/src/lib/${id}/`)) ||
				doc.props.some((prop) => new RegExp(`\\b${symbol.name}\\b`).test(prop.type))
		)
		.map((symbol) => symbol.name)
		.sort();
	const typeImports = types.length
		? `\n\nType imports (package, also required by copied sources):\n\n\`\`\`ts\nimport type { ${types.join(', ')} } from 'bref-ui/types';\n\`\`\``
		: '';
	const packageImport = `Package import:\n\n\`\`\`ts\nimport { ${name} } from 'bref-ui';\n\`\`\``;
	if (!registry.has(id))
		return {
			copyable: false,
			installation: `Package only; no copy command is available.\n\n${packageImport}${typeImports}`
		};
	const entries = planDependencies(id, registry);
	const imports = entries.flatMap((entry) => Object.keys(entry.exports));
	const files = entries.flatMap((entry) =>
		entry.files.map((file) => `- ${path.posix.join(entry.id, file)}`)
	);
	return {
		copyable: true,
		installation: `Preview and install from an initialized project:\n\n\`\`\`sh\nnpx bref-ui add ${id}\n# or\npnpm exec bref-ui add ${id}\n\`\`\`\n\nCopied components/dependencies (dependency first): ${entries.map((entry) => entry.id).join(', ')}.\n\nFiles under the configured #bref/* directory:\n${files.join('\n')}\n- index.ts (component exports)\n\nAvailable copied imports:\n\n\`\`\`ts\nimport { ${imports.join(', ')} } from '#bref';\n\`\`\`\n\n${packageImport}${typeImports}${id === 'theme' ? '\n\nCopied Theme is default-only; edit its tokens directly. Package Theme accepts palette props.' : ''}\n\nThis reference performs no installation. See bref-ui docs cli for init, previews and overwrite approvals.`
	};
};
