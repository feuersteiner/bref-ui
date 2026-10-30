import type { ComponentDocProps } from '../types/docs.js';
import buttonDoc from '../button/docs.js';
import comboboxDoc from '../combobox/docs.js';
import iconDoc from '../icon/docs.js';
import surfaceDoc from '../surface/docs.js';
import themeDoc from '../theme/docs.js';
import themeModeToggleDoc from '../theme-mode-toggle/docs.js';
import checkboxDoc from '../checkbox/docs.js';
import switchDoc from '../switch/docs.js';
import progressDoc from '../progress/docs.js';
import spinnerDoc from '../spinner/docs.js';
import dialogDoc from '../dialog/docs.js';
import popoverDoc from '../popover/docs.js';
import textInputDoc from '../text-input/docs.js';
import textAreaDoc from '../text-area/docs.js';
import treeViewDoc from '../tree-view/docs.js';
import pillDoc from '../pill/docs.js';
import pillGroupDoc from '../pill-group/docs.js';
import pillChoiceGroupDoc from '../pill-choice-group/docs.js';
import selectDoc from '../select/docs.js';
import tabsDoc from '../tabs/docs.js';

/** Canonical references, separate from component runtime exports. */
export const componentDocs: Record<string, ComponentDocProps> = {
	button: buttonDoc,
	combobox: comboboxDoc,
	icon: iconDoc,
	surface: surfaceDoc,
	theme: themeDoc,
	'theme-mode-toggle': themeModeToggleDoc,
	checkbox: checkboxDoc,
	switch: switchDoc,
	progress: progressDoc,
	spinner: spinnerDoc,
	dialog: dialogDoc,
	popover: popoverDoc,
	'text-input': textInputDoc,
	'text-area': textAreaDoc,
	'tree-view': treeViewDoc,
	pill: pillDoc,
	'pill-group': pillGroupDoc,
	'pill-choice-group': pillChoiceGroupDoc,
	select: selectDoc,
	tabs: tabsDoc
};
