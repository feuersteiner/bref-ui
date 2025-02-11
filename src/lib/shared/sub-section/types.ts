import type { IGridSizeProps, ITextAlignmentProps, SizeType } from '../types.js';

/**
 * Props interface for SubSection container component
 * @interface ISubSectionContainerProps
 * @extends {ITextAlignmentProps}
 * @extends {IGridSizeProps}
 *
 * @property {SizeType} gapSize - Size of gap between child elements
 * @property {boolean} [justifyUp] - Whether to justify content upwards
 * @property {number} [itemsCount] - Number of items in the container. If provided, overrides gridSize props
 */
export interface ISubSectionContainerProps extends ITextAlignmentProps, IGridSizeProps {
	gapSize: SizeType;
	justifyUp?: boolean;
	itemsCount?: number;
}
