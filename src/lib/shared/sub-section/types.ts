import type { IClassNameProps, IGridSizeProps, ITextAlignmentProps, SizeType } from '../types.js';

/**
 * Props interface for SubSection container component
 * @interface ISubSectionContainerProps
 * @extends {ITextAlignmentProps}
 * @extends {IGridSizeProps}
 *
 * @property {SizeType} gapSize - Size of gap between child elements
 * @property {boolean} [justifyUp] - Whether to justify content upwards
 * @property {number} [itemsCount] - Number of items in the container. If provided, overrides gridSize props
 * @property {number} [order] - Order of the container in the parent component
 */
export interface ISubSectionContainerProps
	extends ITextAlignmentProps,
		IGridSizeProps,
		IClassNameProps {
	gapSize: SizeType;
	justifyUp?: boolean;
	itemsCount?: number;
	order?: number;
}
