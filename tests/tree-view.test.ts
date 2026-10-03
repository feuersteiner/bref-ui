/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
	indexTree,
	keyboardTarget as targetFor,
	nextFocusAfterChange,
	typeaheadMatch,
	visibleItems as rowsFor
} from '../src/lib/tree-view/state.js';
import type { TreeItemProps as TreeItem } from '../src/lib/tree-view/types.js';

const items: TreeItem[] = [
	{ id: 'a', label: 'Alpha' },
	{ id: 'a1', label: 'Apple', parentId: 'a' },
	{ id: 'a2', label: 'Apricot', disabled: true, parentId: 'a' },
	{ id: 'a21', label: 'Banana', parentId: 'a2' },
	{ id: 'b', label: 'Beta' }
];
const visibleItems = (nodes: TreeItem[], expanded: string[]) =>
	rowsFor(indexTree(nodes), Object.fromEntries(expanded.map((id) => [id, true])), false);
const keyboardTarget = (
	visible: ReturnType<typeof rowsFor>,
	expanded: string[],
	id: string,
	key: string
) =>
	targetFor(
		visible,
		indexTree(items),
		Object.fromEntries(expanded.map((id) => [id, true])),
		false,
		id,
		key
	);

describe('tree state', () => {
	test('rejects duplicate IDs and cycles', () => {
		expect(() =>
			indexTree([
				{ id: 'a', label: 'One' },
				{ id: 'a', label: 'Two' }
			])
		).toThrow();
		const cycle: TreeItem = { id: 'cycle', label: 'Cycle', parentId: 'cycle' };
		expect(() => indexTree([cycle])).toThrow();
	});

	test('follows expansion through disabled parents', () => {
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
			items.filter((item) => item.id !== 'a1'),
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
