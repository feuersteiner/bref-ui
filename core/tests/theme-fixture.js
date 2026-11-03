import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { fromStore, writable } from 'svelte/store';
import * as crystalCode from 'bref-ui-themes/crystal-code';
import * as glassy from 'bref-ui-themes/glassy';
import * as newParis from 'bref-ui-themes/new-paris';
import * as vscode from 'bref-ui-themes/vscode';

const themes = { 'crystal-code': crystalCode, glassy, 'new-paris': newParis, vscode };
const instances = new Map();

export const add = (name, palette, parent = document.body) => {
	const target = document.createElement('section');
	parent.append(target);
	const colors = writable(palette);
	const state = fromStore(colors);
	const { Theme, Button } = themes[name];
	const instance = mount(Theme, {
		target,
		props: {
			get palette() {
				return state.current;
			},
			children: createRawSnippet(() => ({
				render: () => '<div data-content></div>',
				setup: (element) => {
					const buttons = ['neutral', 'soft', 'filled'].map((variant) =>
						mount(Button, { target: element, props: { label: variant, color: 'primary', variant } })
					);
					return () => buttons.forEach((button) => unmount(button));
				}
			}))
		}
	});
	flushSync();
	const wrapper = target.querySelector('[data-bref-theme]');
	const id = String(instances.size);
	wrapper.dataset.testId = id;
	instances.set(id, { colors, instance, target });
	return id;
};

export const update = (id, palette) => {
	instances.get(id).colors.set(palette);
	flushSync();
};

export const colors = (id) => {
	const wrapper = document.querySelector(`[data-test-id="${id}"]`);
	const result = { scheme: getComputedStyle(wrapper).colorScheme };
	for (const role of ['primary', 'secondary', 'background', 'foreground']) {
		const probe = document.createElement('span');
		probe.style.color = `var(--color-${role})`;
		wrapper.append(probe);
		result[role] = getComputedStyle(probe).color;
		probe.remove();
	}
	return result;
};
