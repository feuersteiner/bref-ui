import {
	chapter as comboboxChapter,
	sections as comboboxSections
} from '../../combobox/sections.js';
import { chapter as selectChapter, sections as selectSections } from '../../select/sections.js';
import { chapter as tabsChapter, sections as tabsSections } from '../../tabs/sections.js';
import {
	chapter as introductionChapter,
	sections as introductionSections
} from '../../sections.js';
import { chapter as buttonChapter, sections as buttonSections } from '../../button/sections.js';
import { chapter as surfaceChapter, sections as surfaceSections } from '../../surface/sections.js';
import { chapter as iconChapter, sections as iconSections } from '../../icon/sections.js';
import { chapter as themeChapter, sections as themeSections } from '../../theme/sections.js';
import {
	chapter as checkboxChapter,
	sections as checkboxSections
} from '../../checkbox/sections.js';
import { chapter as dialogChapter, sections as dialogSections } from '../../dialog/sections.js';
import { chapter as popoverChapter, sections as popoverSections } from '../../popover/sections.js';
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
			{ title: introductionChapter, href: '/(docs)' },
			{ title: themeChapter, href: '/(docs)/theme' }
		]
	},
	{
		title: 'Base',
		links: [
			{ title: buttonChapter, href: '/(docs)/button' },
			{ title: iconChapter, href: '/(docs)/icon' },
			{ title: pillChapter, href: '/(docs)/pill' },
			{ title: pillGroupChapter, href: '/(docs)/pill-group' },
			{ title: tabsChapter, href: '/(docs)/tabs' },
			{ title: treeViewChapter, href: '/(docs)/tree-view' }
		]
	},
	{
		title: 'Feedback',
		links: [
			{ title: progressChapter, href: '/(docs)/progress' },
			{ title: spinnerChapter, href: '/(docs)/spinner' }
		]
	},
	{
		title: 'Inputs',
		links: [
			{ title: checkboxChapter, href: '/(docs)/checkbox' },
			{ title: comboboxChapter, href: '/(docs)/combobox' },
			{ title: pillChoiceGroupChapter, href: '/(docs)/pill-choice-group' },
			{ title: selectChapter, href: '/(docs)/select' },
			{ title: switchChapter, href: '/(docs)/switch' },
			{ title: textAreaChapter, href: '/(docs)/text-area' },
			{ title: textInputChapter, href: '/(docs)/text-input' }
		]
	},
	{
		title: 'Surfaces',
		links: [
			{ title: dialogChapter, href: '/(docs)/dialog' },
			{ title: popoverChapter, href: '/(docs)/popover' },
			{ title: surfaceChapter, href: '/(docs)/surface' }
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
	'/surface': surfaceSections,
	'/dialog': dialogSections,
	'/popover': popoverSections,
	'/select': selectSections,
	'/tabs': tabsSections,
	'/combobox': comboboxSections,
	'/checkbox': checkboxSections,
	'/switch': switchSections,
	'/progress': progressSections,
	'/spinner': spinnerSections,
	'/text-input': textInputSections,
	'/text-area': textAreaSections,
	'/tree-view': treeViewSections,
	'/pill': pillSections,
	'/pill-group': pillGroupSections,
	'/pill-choice-group': pillChoiceGroupSections,
	'/theme': themeSections
};
