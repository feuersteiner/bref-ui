import {
	chapter as introductionChapter,
	sections as introductionSections
} from '../../sections.js';
import { chapter as buttonChapter, sections as buttonSections } from '../../button/sections.js';
import { chapter as iconChapter, sections as iconSections } from '../../icon/sections.js';
import { chapter as themeChapter, sections as themeSections } from '../../theme/sections.js';
import {
	chapter as treeViewChapter,
	sections as treeViewSections
} from '../../tree-view/sections.js';

export const navigation = [
	{
		title: 'Get started',
		links: [
			{ title: introductionChapter, href: '/' },
			{ title: themeChapter, href: '/theme' }
		]
	},
	{
		title: 'Components',
		links: [
			{ title: buttonChapter, href: '/button' },
			{ title: iconChapter, href: '/icon' },
			{ title: treeViewChapter, href: '/tree-view' }
		]
	}
] as const;

export interface PageSection {
	id: string;
	title: string;
}

export const pageSections: Record<string, readonly PageSection[]> = {
	'/': introductionSections,
	'/button': buttonSections,
	'/icon': iconSections,
	'/tree-view': treeViewSections,
	'/theme': themeSections
};
