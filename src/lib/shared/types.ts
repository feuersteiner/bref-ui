export interface ITextAlignmentProps {
	align: 'left' | 'center' | 'right';
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

export interface IButtonProps extends ILinkProps, Partial<IButtonSizeProps> {
	type?: 'primary' | 'secondary' | 'default';
}

export interface IButtonSizeProps {
	size: 'small' | 'medium' | 'large';
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
