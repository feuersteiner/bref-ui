import type { IGridSizeProps, ITextAlignmentProps, SizeType } from '../types.js';

export interface ISubSectionContainerProps extends ITextAlignmentProps, IGridSizeProps {
	gapSize: SizeType;
	justifyUp?: boolean;
}
