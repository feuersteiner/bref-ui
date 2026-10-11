import packageInfo from '../../../package.json' with { type: 'json' };
import { componentUsage } from '../components/component-usage.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = () => {
	const documents = Object.entries(componentUsage).map(
		([name, { purpose, setup, example, props }]) => {
			const source = `<script lang="ts">\n  import { ${name} } from 'bref-ui';${setup ? `\n  ${setup}` : ''}\n</script>\n\n${example}`;
			return `## ${name}\n\n${purpose}\n\n\`\`\`svelte\n${source}\n\`\`\`\n\nProps: ${props}`;
		}
	);

	return new Response(`# ${packageInfo.name}\n\n${documents.join('\n\n')}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
