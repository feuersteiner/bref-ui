import { chapter as demoChapter, sections as demoSections } from './sections.js';
import { chapter as todoChapter } from './todo/sections.js';
import { chapter as houseShopChapter } from './house-shop/sections.js';
import { chapter as runnerAiChapter } from './runner-ai/sections.js';
import { sections as paletteSections } from './themes/[theme]/sections.js';

export const demoPages = [
	{
		title: todoChapter,
		href: 'demo/todo',
		palette: 'relay',
		icon: 'checklist',
		cover: {
			src: 'previews/demo-todo.jpg',
			alt: 'Todo project workspace with task filters and a task board.',
			width: 1272,
			height: 716
		},
		description: 'Organize projects, edit tasks and track completed work.'
	},
	{
		title: houseShopChapter,
		href: 'demo/house-shop',
		palette: 'forma',
		icon: 'storefront',
		cover: {
			src: 'previews/demo-house-shop.jpg',
			alt: 'House Shop furniture store with its product collection.',
			width: 1272,
			height: 716
		},
		description: 'Browse furniture and manage a shopping cart.'
	},
	{
		title: runnerAiChapter,
		href: 'demo/runner-ai',
		palette: 'elsewhere',
		icon: 'smart_toy',
		cover: {
			src: 'previews/demo-runner-ai.jpg',
			alt: 'RunnerAI workspace with assessment runs and copy review.',
			width: 1280,
			height: 720
		},
		description: 'Assess marketing copy, follow each check and apply suggested edits.'
	}
] as const;

export const palettePages = [
	{ title: 'Relay palette', href: 'demo/themes/relay', palette: 'relay' },
	{ title: 'Forma palette', href: 'demo/themes/forma', palette: 'forma' },
	{ title: 'Elsewhere palette', href: 'demo/themes/elsewhere', palette: 'elsewhere' }
] as const;

export const demoNavigation = {
	title: demoChapter,
	href: 'demo'
} as const;

export const demoPageSections = {
	'/demo': demoSections,
	...Object.fromEntries(palettePages.map((page) => [`/${page.href}`, paletteSections]))
};
