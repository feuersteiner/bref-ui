import type { IButtonProps, ISizeProps, ITextAlignmentProps } from '../types.js';

export interface IButtonRowProps extends ISizeProps, Partial<ITextAlignmentProps> {
	primaryButton?: IButtonProps;
	secondaryButton?: IButtonProps;
	snug?: boolean;
}
