import { resolve } from '$app/paths';
import packageInfo from '../../../package.json' with { type: 'json' };
import { navigation } from '../components/layout/navigation.js';
import { documentationToMarkdown } from '../components/documentation.server.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = async ({ fetch }) => {
	const documents = await Promise.all(
		navigation.flatMap(({ links }) =>
			links
				.filter(({ href }) => href !== '/')
				.map(async ({ href }) => {
					const path = resolve(href);
					const response = await fetch(path);
					if (!response.ok)
						throw new Error(`Cannot load documentation: ${href} (${response.status})`);
					const html = await response.text();
					const name = href
						.slice(1)
						.replace(/(^|-)(\w)/g, (_match, _separator, letter: string) => letter.toUpperCase());
					const document = documentationToMarkdown(html, name);
					return href === '/theme'
						? `${document}\n\n${documentationToMarkdown(html, 'ThemeModeToggle')}`
						: document;
				})
		)
	);

	return new Response(`# ${packageInfo.name}\n\n${documents.join('\n\n')}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
