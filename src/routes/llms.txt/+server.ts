import packageInfo from '../../../package.json' with { type: 'json' };
import buttonUsage from './button.js';
import iconUsage from './icon.js';
import themeUsage from './theme.js';
import themeModeToggleUsage from './theme-mode-toggle.js';
import surfaceUsage from './surface.js';
import checkboxUsage from './checkbox.js';
import switchUsage from './switch.js';
import textInputUsage from './text-input.js';
import textAreaUsage from './text-area.js';
import progressUsage from './progress.js';
import spinnerUsage from './spinner.js';
import pillUsage from './pill.js';
import pillGroupUsage from './pill-group.js';
import pillChoiceGroupUsage from './pill-choice-group.js';
import selectUsage from './select.js';
import comboboxUsage from './combobox.js';
import treeViewUsage from './tree-view.js';
import dialogUsage from './dialog.js';
import popoverUsage from './popover.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

const componentUsage: Record<
	string,
	{ purpose: string; setup?: string; example: string; props: string }
> = {
	Button: buttonUsage,
	Icon: iconUsage,
	Theme: themeUsage,
	ThemeModeToggle: themeModeToggleUsage,
	Surface: surfaceUsage,
	Checkbox: checkboxUsage,
	Switch: switchUsage,
	TextInput: textInputUsage,
	TextArea: textAreaUsage,
	Progress: progressUsage,
	Spinner: spinnerUsage,
	Pill: pillUsage,
	PillGroup: pillGroupUsage,
	PillChoiceGroup: pillChoiceGroupUsage,
	Select: selectUsage,
	Combobox: comboboxUsage,
	TreeView: treeViewUsage,
	Dialog: dialogUsage,
	Popover: popoverUsage
};

export const GET: RequestHandler = () => {
	const documents = Object.entries(componentUsage).map(
		([name, { purpose, setup, example, props }]) => {
			const source = `<script lang="ts">\n  import { ${name} } from 'bref-ui';${setup ? `\n  ${setup}` : ''}\n</script>\n\n${example}`;
			return `## ${name}\n\n${purpose}\n\n\`\`\`svelte\n${source}\n\`\`\`\n\nProps: ${props}`;
		}
	);

	return new Response(`# ${packageInfo.name}\n\n${documents.join('\n\n')}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
