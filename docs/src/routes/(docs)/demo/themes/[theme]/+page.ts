import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';

const themes = ['relay', 'forma', 'elsewhere'] as const;
export const entries = () => themes.map((theme) => ({ theme }));
export const load: PageLoad = ({ params }) => {
	const theme = themes.find((theme) => theme === params.theme);
	if (!theme) error(404, 'Theme demonstration not available.');
	return { theme };
};
