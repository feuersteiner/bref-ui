import type { ITextAlignmentProps, SizeType } from '../types.js';

export interface ISubSectionContainerProps extends ITextAlignmentProps {
	gridSize: 'full' | 'half' | 'third' | 'quarter';
	gapSize: SizeType;
}
