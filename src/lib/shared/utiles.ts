import type { GridSizeType } from './types.js';

export const inferGridSizeFromItems = (items: any[]): GridSizeType => {
	if (items.length % 4 === 0) return 'quarter';
	if (items.length % 3 === 0) return 'third';
	if (items.length % 2 === 0) return 'half';
	return 'full';
};
