import {
	chapter as introductionChapter,
	sections as introductionSections
} from '../../sections.js';
import { chapter as buttonChapter, sections as buttonSections } from '../../button/sections.js';
import { chapter as iconChapter, sections as iconSections } from '../../icon/sections.js';
import { chapter as themeChapter, sections as themeSections } from '../../theme/sections.js';
import {
	chapter as checkboxChapter,
	sections as checkboxSections
} from '../../checkbox/sections.js';
import { chapter as dialogChapter, sections as dialogSections } from '../../dialog/sections.js';
import { chapter as switchChapter, sections as switchSections } from '../../switch/sections.js';
import {
	chapter as progressChapter,
	sections as progressSections
} from '../../progress/sections.js';
import { chapter as spinnerChapter, sections as spinnerSections } from '../../spinner/sections.js';
import {
	chapter as textInputChapter,
	sections as textInputSections
} from '../../text-input/sections.js';
import {
	chapter as textAreaChapter,
	sections as textAreaSections
} from '../../text-area/sections.js';
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
			{ title: dialogChapter, href: '/dialog' },
			{ title: checkboxChapter, href: '/checkbox' },
			{ title: switchChapter, href: '/switch' },
			{ title: progressChapter, href: '/progress' },
			{ title: spinnerChapter, href: '/spinner' },
			{ title: textInputChapter, href: '/text-input' },
			{ title: textAreaChapter, href: '/text-area' },
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
	'/dialog': dialogSections,
	'/checkbox': checkboxSections,
	'/switch': switchSections,
	'/progress': progressSections,
	'/spinner': spinnerSections,
	'/text-input': textInputSections,
	'/text-area': textAreaSections,
	'/tree-view': treeViewSections,
	'/theme': themeSections
};
