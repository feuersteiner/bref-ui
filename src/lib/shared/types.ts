export interface ITextAlignmentProps {
	align: 'left' | 'center' | 'right';
}

export interface ISizeProps {
	size: 'small' | 'medium' | 'large';
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
}

export interface IMediaProps {
	src: string;
	alt: string;
	type: 'image' | 'video';
}

export interface ISectionContainerProps {
	anchor?: string;
}

export interface IBaseSectionProps extends ITitleProps, ISubtitleProps, ISectionContainerProps {
	primaryButton?: IButtonProps;
	secondaryButton?: IButtonProps;
}

export interface ILogoProps extends Omit<IMediaProps, 'type'>, ILinkProps, ISizeProps {}
