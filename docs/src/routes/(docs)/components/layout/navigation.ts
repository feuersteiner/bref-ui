import { resolve } from '$app/paths';
import { chapter as configChapter, sections as configSections } from '../../config/sections.js';
import { chapter as themesChapter, sections as themesSections } from '../../themes/sections.js';
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
		links: [{ title: introductionChapter, href: resolve('/(docs)') }]
	},
	{
		title: 'Config',
		links: [
			{ title: configChapter, href: resolve('/(docs)/config') },
			{ title: themeChapter, href: resolve('/(docs)/theme') }
		]
	},
	{
		title: 'Skins',
		links: [
			{ title: 'All skins', href: resolve('/(skins)/skins') },
			{ title: 'Todo', href: resolve('/(skins)/skins/(sites)/(todo)/todo') },
			{ title: 'House Shop', href: resolve('/(skins)/skins/(sites)/(house-shop)/house-shop') },
			{ title: 'RunnerAI', href: resolve('/(skins)/skins/(sites)/(runner-ai)/runner-ai') }
		]
	},
	{
		title: 'Themes',
		links: [{ title: themesChapter, href: resolve('/(docs)/themes') }]
	},

	{
		title: 'Base',
		links: [
			{ title: buttonChapter, href: resolve('/(docs)/button') },
			{ title: iconChapter, href: resolve('/(docs)/icon') },
			{ title: pillChapter, href: resolve('/(docs)/pill') },
			{ title: pillGroupChapter, href: resolve('/(docs)/pill-group') },
			{ title: tabsChapter, href: resolve('/(docs)/tabs') },
			{ title: treeViewChapter, href: resolve('/(docs)/tree-view') }
		]
	},
	{
		title: 'Feedback',
		links: [
			{ title: progressChapter, href: resolve('/(docs)/progress') },
			{ title: spinnerChapter, href: resolve('/(docs)/spinner') }
		]
	},
	{
		title: 'Inputs',
		links: [
			{ title: checkboxChapter, href: resolve('/(docs)/checkbox') },
			{ title: comboboxChapter, href: resolve('/(docs)/combobox') },
			{ title: pillChoiceGroupChapter, href: resolve('/(docs)/pill-choice-group') },
			{ title: selectChapter, href: resolve('/(docs)/select') },
			{ title: switchChapter, href: resolve('/(docs)/switch') },
			{ title: textAreaChapter, href: resolve('/(docs)/text-area') },
			{ title: textInputChapter, href: resolve('/(docs)/text-input') }
		]
	},
	{
		title: 'Surfaces',
		links: [
			{ title: dialogChapter, href: resolve('/(docs)/dialog') },
			{ title: popoverChapter, href: resolve('/(docs)/popover') },
			{ title: surfaceChapter, href: resolve('/(docs)/surface') }
		]
	}
] as const;

export interface PageSection {
	id: string;
	title: string;
}

export const pageSections: Record<string, readonly PageSection[]> = {
	'/config': configSections,
	'/themes': themesSections,
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
