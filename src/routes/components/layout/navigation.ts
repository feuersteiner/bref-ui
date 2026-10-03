import {
	chapter as introductionChapter,
	sections as introductionSections
} from '../../sections.js';
import { chapter as buttonChapter, sections as buttonSections } from '../../button/sections.js';
import { chapter as iconChapter, sections as iconSections } from '../../icon/sections.js';
import { chapter as themeChapter, sections as themeSections } from '../../theme/sections.js';
import { chapter as pillChapter, sections as pillSections } from '../../pill/sections.js';
import {
	chapter as pillGroupChapter,
	sections as pillGroupSections
} from '../../pill-group/sections.js';
import {
	chapter as pillChoiceGroupChapter,
	sections as pillChoiceGroupSections
} from '../../pill-choice-group/sections.js';

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
			{ title: pillChapter, href: '/pill' },
			{ title: pillGroupChapter, href: '/pill-group' },
			{ title: pillChoiceGroupChapter, href: '/pill-choice-group' }
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
	'/pill': pillSections,
	'/pill-group': pillGroupSections,
	'/pill-choice-group': pillChoiceGroupSections,
	'/theme': themeSections
};
