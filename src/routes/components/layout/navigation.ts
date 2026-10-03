import {
	chapter as introductionChapter,
	sections as introductionSections
} from '../../sections.js';
import { chapter as buttonChapter, sections as buttonSections } from '../../button/sections.js';
import { chapter as iconChapter, sections as iconSections } from '../../icon/sections.js';
import {
	chapter as progressChapter,
	sections as progressSections
} from '../../progress/sections.js';
import { chapter as spinnerChapter, sections as spinnerSections } from '../../spinner/sections.js';
import { chapter as themeChapter, sections as themeSections } from '../../theme/sections.js';

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
			{ title: progressChapter, href: '/progress' },
			{ title: spinnerChapter, href: '/spinner' }
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
	'/progress': progressSections,
	'/spinner': spinnerSections,
	'/theme': themeSections
};
