/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
	indexTree,
	keyboardTarget,
	nextFocusAfterChange,
	typeaheadMatch,
	validIds,
	visibleItems
} from '../src/lib/tree-view/state.js';
import type { TreeItem } from '../src/lib/tree-view/types.js';

const items: TreeItem[] = [
	{
		id: 'a',
		label: 'Alpha',
		children: [
			{ id: 'a1', label: 'Apple' },
			{ id: 'a2', label: 'Apricot', disabled: true, children: [{ id: 'a21', label: 'Banana' }] }
		]
	},
	{ id: 'b', label: 'Beta' }
];

describe('tree state', () => {
	test('rejects duplicate IDs and cycles', () => {
		expect(() =>
			indexTree([
				{ id: 'a', label: 'One' },
				{ id: 'a', label: 'Two' }
			])
		).toThrow();
		const cycle: TreeItem = { id: 'cycle', label: 'Cycle' };
		(cycle as { children?: TreeItem[] }).children = [cycle];
		expect(() => indexTree([cycle])).toThrow();
	});

	test('prunes unknown IDs and follows expansion through disabled parents', () => {
		const indexed = indexTree(items);
		expect(validIds(['a', 'missing', 'a', 'a2'], indexed)).toEqual(['a', 'a2']);
		expect(visibleItems(items, ['a']).map(({ item }) => item.id)).toEqual(['a', 'a1', 'a2', 'b']);
		expect(visibleItems(items, ['a', 'a2']).map(({ item }) => item.id)).toEqual([
			'a',
			'a1',
			'a2',
			'a21',
			'b'
		]);
	});

	test('recovers focus to collapsed ancestor, then nearest surviving item', () => {
		const before = visibleItems(items, ['a', 'a2']);
		expect(nextFocusAfterChange(before, visibleItems(items, []), 'a21')).toBe('a');
		expect(nextFocusAfterChange(before, visibleItems([{ id: 'b', label: 'Beta' }], []), 'a1')).toBe(
			'b'
		);
		const removed = visibleItems(
			[{ id: 'a', label: 'Alpha', children: [items[0].children![1]] }, items[1]],
			['a']
		);
		expect(nextFocusAfterChange(before, removed, 'a1', false)).toBe('a2');
	});

	test('typeahead wraps from the focused row and includes disabled items', () => {
		const visible = visibleItems(items, ['a']);
		expect(typeaheadMatch(visible, 'a1', 'ap')).toBe('a2');
		expect(typeaheadMatch(visible, 'b', 'al')).toBe('a');
	});

	test('keyboard targets follow visible rows and parent structure', () => {
		const visible = visibleItems(items, ['a']);
		expect(keyboardTarget(visible, ['a'], 'a', 'ArrowRight')).toEqual({ focusId: 'a1' });
		expect(keyboardTarget(visible, ['a'], 'a1', 'ArrowLeft')).toEqual({ focusId: 'a' });
		expect(keyboardTarget(visible, ['a'], 'a2', 'ArrowDown')).toEqual({ focusId: 'b' });
		expect(keyboardTarget(visible, ['a'], 'b', 'ArrowUp')).toEqual({ focusId: 'a2' });
		expect(keyboardTarget(visible, ['a'], 'b', 'Home')).toEqual({ focusId: 'a' });
		expect(keyboardTarget(visible, ['a'], 'a', 'End')).toEqual({ focusId: 'b' });
		expect(keyboardTarget(visible, ['a'], 'a2', 'ArrowRight')).toEqual({ toggleId: 'a2' });
		expect(keyboardTarget(visible, ['a'], 'a', 'ArrowLeft')).toEqual({ toggleId: 'a' });
	});
});
