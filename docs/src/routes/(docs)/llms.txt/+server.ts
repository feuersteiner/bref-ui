import { componentDocs } from 'bref-ui/docs';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(
		'# bref-ui\n\n' +
			Object.entries(componentDocs)
				.map(
					([id, doc]) =>
						`## ${id}\n\n${doc.description}\n\n${doc.usage}\n\nProps: ${doc.props.map((prop) => `${prop.name}${prop.required ? '' : '?'}: ${prop.type}${prop.default ? ` = ${prop.default}` : ''}${prop.bindable ? ' (bindable)' : ''} — ${prop.description}`).join('; ')}`
				)
				.join('\n\n') +
			'\n',
		{ headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
	);
