import type { IButtonPairProps } from './button/types.js';

export interface ITextAlignmentProps {
	align: 'left' | 'center' | 'right';
}

export type SizeType = 'small' | 'medium' | 'large';

export interface ISizeProps {
	size: SizeType;
}

export interface ITitleProps extends Partial<ITextAlignmentProps> {
	title: string;
}

export interface ISubtitleProps extends Partial<ITextAlignmentProps> {
	subtitle: string;
}

export interface ILinkProps {
	label: string;
	href: string;
	isTargetBlank?: boolean;
}

export interface IButtonProps extends ILinkProps, Partial<ISizeProps> {
	type?: 'primary' | 'secondary' | 'default';
	fullWidth?: boolean;
}

export interface IMediaProps extends IClassNameProps {
	src: string;
	alt: string;
	type: 'image' | 'video';
	fill?: boolean;
}

export interface IClassNameProps {
	className?: string;
}

export interface ISectionContainerProps extends IBackgroundColorProps, IClassNameProps {
	anchor?: string;
	minimalPadding?: boolean;
	gap?: SizeType;
}

export interface IBackgroundColorProps {
	isBackgroundColorSecondary?: boolean;
}

export interface IBaseSectionProps
	extends ITitleProps,
		ISubtitleProps,
		ISectionContainerProps,
		IButtonPairProps {}

export interface ILogoProps extends Omit<IMediaProps, 'type'>, ILinkProps, ISizeProps {}

export type GridSizeType = 'full' | 'half' | 'third' | 'quarter' | 'sixth' | 'twelfth';
export interface IGridSizeProps {
	gridSize: GridSizeType;
}
