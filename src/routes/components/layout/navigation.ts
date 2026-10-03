import {
	chapter as introductionChapter,
	sections as introductionSections
} from '../../sections.js';
import { chapter as buttonChapter, sections as buttonSections } from '../../button/sections.js';
import { chapter as iconChapter, sections as iconSections } from '../../icon/sections.js';
import { chapter as themeChapter, sections as themeSections } from '../../theme/sections.js';

import { chapter as inputChapter, sections as inputSections } from '../../input/sections.js';
import { chapter as selectChapter, sections as selectSections } from '../../select/sections.js';
import {
	chapter as comboboxChapter,
	sections as comboboxSections
} from '../../combobox/sections.js';

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
			{ title: inputChapter, href: '/input' },
			{ title: selectChapter, href: '/select' },
			{ title: comboboxChapter, href: '/combobox' }
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
	'/input': inputSections,
	'/select': selectSections,
	'/combobox': comboboxSections,
	'/theme': themeSections
};
