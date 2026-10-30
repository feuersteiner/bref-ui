import { posix } from 'node:path';
import type { RegistryEntry } from '../registry/types.js';

/**
 * Format installation guidance from an existing dependency plan and public type names.
 * Empty entries identify a package-only component. No files are read or written.
 */
export const formatInstallation = (
	id: string,
	name: string,
	entries: RegistryEntry[],
	types: string[]
): string => {
	const typeImports = types.length
		? `\n\nType imports (package, also required by copied sources):\n\n\`\`\`ts\nimport type { ${types.join(', ')} } from 'bref-ui/types';\n\`\`\``
		: '';
	const packageImport = `Package import:\n\n\`\`\`ts\nimport { ${name} } from 'bref-ui';\n\`\`\``;
	if (entries.length === 0)
		return `Package only; no copy command is available.\n\n${packageImport}${typeImports}`;
	const imports = entries.flatMap((entry) => Object.keys(entry.exports));
	const files = entries.flatMap((entry) =>
		entry.files.map((file) => `- ${posix.join(entry.id, file)}`)
	);
	return `Preview and install from an initialized project:\n\n\`\`\`sh\nnpx bref-ui add ${id}\n# or\npnpm exec bref-ui add ${id}\n\`\`\`\n\nCopied components/dependencies (dependency first): ${entries.map((entry) => entry.id).join(', ')}.\n\nFiles under the configured #bref/* directory:\n${files.join('\n')}\n- index.ts (component exports)\n\nAvailable copied imports:\n\n\`\`\`ts\nimport { ${imports.join(', ')} } from '#bref';\n\`\`\`\n\n${packageImport}${typeImports}${id === 'theme' ? '\n\nCopied Theme is default-only; edit its tokens directly. Package Theme accepts palette props.' : ''}\n\nThis reference performs no installation. See bref-ui docs cli for init, previews and overwrite approvals.`;
};
