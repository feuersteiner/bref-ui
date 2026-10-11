import { parseHTML } from 'linkedom';
import { componentUsage } from './component-usage.js';

export const documentationToMarkdown = (html: string, name: string) => {
	const { document } = parseHTML(html);
	const table = document.querySelector('article table');
	const usage = componentUsage[name];
	if (!table || !usage) throw new Error(`Incomplete component documentation: ${name}`);

	const props = Array.from(table.querySelectorAll('tbody tr'), (row) =>
		Array.from(row.querySelectorAll('th, td'), (cell) => cell.textContent.trim())
	).filter(([prop]) => !prop.includes(':') || prop.startsWith(`${name}:`));
	if (!props.length) throw new Error(`Missing component props: ${name}`);
	const rows = props.map(
		(cells) =>
			`| ${cells
				.map((cell, index) => {
					const text = cell.replace(`${name}: `, '').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
					return [0, 1, 3].includes(index) ? `\`${text}\`` : text;
				})
				.join(' | ')} |`
	);
	const source = `<script lang="ts">\n  import { ${name} } from 'bref-ui';${usage.setup ? `\n  ${usage.setup}` : ''}\n</script>\n\n${usage.example}`;

	return `## ${name}\n\n${usage.purpose}\n\n### Usage\n\n\`\`\`svelte\n${source}\n\`\`\`\n\n### Props\n\n| Prop | Type | Required | Default | Description |\n| --- | --- | --- | --- | --- |\n${rows.join('\n')}`;
};
