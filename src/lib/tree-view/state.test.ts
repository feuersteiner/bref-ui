/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
	childrenFor,
	indexTree,
	keyboardTarget,
	nextFocusAfterChange,
	rootsFor,
	typeaheadMatch,
	visibleItems
} from './state.js';
import { revealSelection } from './selection.js';
import type { TreeItemProps, TreeSectionProps } from './types.js';

const sections: TreeSectionProps[] = [
	{ id: 'work', label: 'Work' },
	{ id: 'home', label: 'Home' }
];
const items: TreeItemProps[] = [
	{ id: 'home-root', label: 'Home root', sectionId: 'home' },
	{ id: 'work-root', label: 'Work root', sectionId: 'work' },
	{ id: 'child', label: 'Child', parentId: 'work-root', sectionId: 'work', disabled: true },
	{ id: 'grandchild', label: 'Grandchild', parentId: 'child', sectionId: 'work' },
	{ id: 'plain', label: 'Plain' },
	{ id: 'sibling', label: 'Sibling', parentId: 'work-root', sectionId: 'work' }
];

describe('flat tree index', () => {
	test('reveals selected ancestors without expanding the selected node or other branches', () => {
		const index = indexTree(items, sections);
		const expanded = revealSelection(index, {}, [], ['grandchild']);
		expect(expanded).toEqual({ child: true, 'work-root': true });
		expect(visibleItems(index, expanded, false).some(({ item }) => item.id === 'grandchild')).toBe(
			true
		);
		expect(revealSelection(index, {}, [], ['work-root'])).toEqual({});
	});

	test('preserves manual collapse and only reveals newly added selections', () => {
		const index = indexTree(items, sections);
		const collapsed = { 'work-root': false, child: false };
		expect(revealSelection(index, collapsed, ['grandchild'], ['grandchild'])).toBe(collapsed);
		expect(revealSelection(index, collapsed, ['grandchild'], ['grandchild', 'home-root'])).toBe(
			collapsed
		);
		expect(revealSelection(index, collapsed, ['home-root'], ['grandchild'])).toEqual({
			'work-root': true,
			child: true
		});
		expect(collapsed).toEqual({ 'work-root': false, child: false });
	});

	test('keeps section and sibling order independent of flat item placement', () => {
		const index = indexTree(items, sections);
		expect(rootsFor(index).map((item) => item.id)).toEqual(['plain']);
		expect(rootsFor(index, 'work').map((item) => item.id)).toEqual(['work-root']);
		expect(childrenFor(index, 'work-root').map((item) => item.id)).toEqual(['child', 'sibling']);
		expect(visibleItems(index, {}, true).map(({ item }) => item.id)).toEqual([
			'plain',
			'work-root',
			'child',
			'grandchild',
			'sibling',
			'home-root'
		]);
	});

	test('rejects invalid identity, parent and section membership', () => {
		expect(() => indexTree([...items, items[0]], sections)).toThrow(/duplicated/);
		expect(() => indexTree(items, [...sections, sections[0]])).toThrow(/duplicated/);
		expect(() => indexTree([{ id: 'a', label: 'A', sectionId: 'missing' }], sections)).toThrow(
			/unknown section/
		);
		expect(() => indexTree([{ id: 'a', label: 'A', parentId: 'missing' }])).toThrow(
			/unknown parent/
		);
		expect(() =>
			indexTree(
				[
					{ id: 'a', label: 'A', sectionId: 'work' },
					{ id: 'b', label: 'B', parentId: 'a' }
				],
				sections
			)
		).toThrow(/section boundary/);
		expect(() =>
			indexTree([
				{ id: 'a', label: 'A', parentId: 'b' },
				{ id: 'b', label: 'B', parentId: 'a' }
			])
		).toThrow(/cycle/);
	});

	test('uses defaults, preserves local toggles and navigates visible disabled rows', () => {
		const index = indexTree(items, sections);
		const collapsed = visibleItems(index, {}, false);
		expect(collapsed.map(({ item }) => item.id)).toEqual(['plain', 'work-root', 'home-root']);
		const expanded = { 'work-root': true, child: true };
		const open = visibleItems(index, expanded, false);
		expect(open.map(({ item }) => item.id)).toEqual([
			'plain',
			'work-root',
			'child',
			'grandchild',
			'sibling',
			'home-root'
		]);
		expanded['work-root'] = false;
		expect(nextFocusAfterChange(open, visibleItems(index, expanded, false), 'grandchild')).toBe(
			'work-root'
		);
		expanded['work-root'] = true;
		expect(visibleItems(index, expanded, false).some(({ item }) => item.id === 'grandchild')).toBe(
			true
		);
		expect(keyboardTarget(open, index, expanded, false, 'child', 'ArrowRight')).toEqual({
			focusId: 'grandchild'
		});
		expect(keyboardTarget(open, index, expanded, false, 'child', 'ArrowLeft')).toEqual({
			toggleId: 'child'
		});
		expect(keyboardTarget(open, index, expanded, false, 'child', 'ArrowDown')).toEqual({
			focusId: 'grandchild'
		});
		expect(keyboardTarget(open, index, expanded, false, 'home-root', 'Home')).toEqual({
			focusId: 'plain'
		});
		expect(typeaheadMatch(open, 'home-root', 'ch')).toBe('child');
	});

	test('retains stable IDs and recovers focus when list data changes', () => {
		const before = visibleItems(indexTree(items, sections), {}, true);
		const changed = visibleItems(
			indexTree(
				items.filter((item) => item.id !== 'sibling'),
				sections
			),
			{},
			true
		);
		expect(nextFocusAfterChange(before, changed, 'sibling', false)).toBe('home-root');
		expect(nextFocusAfterChange(before, changed, 'child')).toBe('child');
	});
});

test('keeps empty-string ancestors and adjacent IDs during focus recovery', () => {
	const items = [
		{ id: 'z', label: 'Zulu' },
		{ id: '', label: 'Empty' },
		{ id: 'child', label: 'Child', parentId: '' }
	];
	const index = indexTree(items);
	const before = visibleItems(index, { '': true }, false);
	const after = visibleItems(index, {}, false);
	expect(nextFocusAfterChange(before, after, 'child')).toBe('');
	expect(keyboardTarget(before, index, { '': true }, false, 'child', 'ArrowLeft')).toEqual({
		focusId: ''
	});
	const removed = visibleItems(
		indexTree(items.filter((item) => item.id !== 'z')),
		{ '': true },
		false
	);
	expect(nextFocusAfterChange(before, removed, 'z', false)).toBe('');
});
